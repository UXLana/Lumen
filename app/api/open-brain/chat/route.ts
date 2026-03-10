import { NextRequest } from 'next/server'
import { createMessage, updateMessage, getMessagesByChannel } from '@/lib/open-brain/db/messages'
import { getChannel } from '@/lib/open-brain/db/channels'
import { getAgentOrThrow, AGENTS } from '@/lib/open-brain/agents/registry'
import { resolveProvider } from '@/lib/open-brain/providers/factory'
import { parseMentions } from '@/lib/open-brain/utils/mentions'
import { createSwarmTask } from '@/lib/open-brain/db/swarm-tasks'
import { incrementUnread } from '@/lib/open-brain/db/unread'
import { emit } from '@/lib/open-brain/sse/event-bus'
import type { AgentId, LLMMessage } from '@/lib/open-brain/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { channelId, content } = await request.json()

    if (!channelId || !content) {
      return new Response(JSON.stringify({ error: 'channelId and content required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const channel = getChannel(channelId)
    if (!channel) {
      return new Response(JSON.stringify({ error: 'Channel not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parse user mentions
    const userMentions = parseMentions(content)

    // Store user message
    const userMessage = createMessage({
      channelId,
      role: 'user',
      content,
      mentions: userMentions,
      status: 'complete',
    })

    emit('message:new', userMessage, channelId)

    // Determine which agent responds
    let respondingAgentId: AgentId

    if (channel.type === 'dm' && channel.agentId) {
      respondingAgentId = channel.agentId
    } else if (userMentions.length > 0) {
      respondingAgentId = userMentions[0]
    } else {
      // Default to orchestrator in shared channels
      respondingAgentId = 'design-system-builder'
    }

    const agent = getAgentOrThrow(respondingAgentId)
    const { provider, model } = resolveProvider(agent)

    // Create placeholder for agent response
    const agentMessage = createMessage({
      channelId,
      role: 'agent',
      agentId: respondingAgentId,
      content: '',
      status: 'streaming',
    })

    emit('message:new', agentMessage, channelId)

    // Build conversation history
    const recentMessages = getMessagesByChannel(channelId, 20)
    const llmMessages: LLMMessage[] = recentMessages
      .filter(m => m.id !== agentMessage.id)
      .map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }))

    // Stream response back via SSE
    const encoder = new TextEncoder()
    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await provider.chat(llmMessages, agent.systemPrompt, model, {
            onToken(token: string) {
              fullResponse += token
              emit('message:stream-chunk', {
                messageId: agentMessage.id,
                token,
                channelId,
              }, channelId)

              // Also stream to the response
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token, messageId: agentMessage.id })}\n\n`))
            },

            onComplete(text: string, usage) {
              // Update message in DB
              updateMessage(agentMessage.id, {
                content: text,
                status: 'complete',
                tokenUsage: usage,
              })

              emit('message:complete', {
                messageId: agentMessage.id,
                content: text,
                channelId,
                agentId: respondingAgentId,
              }, channelId)

              incrementUnread(channelId)

              // Check for @ mentions in agent response to trigger swarming
              const agentMentions = parseMentions(text)
              for (const mentionedId of agentMentions) {
                if (mentionedId !== respondingAgentId) {
                  const task = createSwarmTask({
                    triggerMessageId: agentMessage.id,
                    targetAgentId: mentionedId,
                    sourceAgentId: respondingAgentId,
                    channelId,
                    depth: 1,
                  })
                  if (task) {
                    emit('swarm:started', { task, channelId }, channelId)
                    // Process swarm asynchronously
                    processSwarmTask(task.id).catch(console.error)
                  }
                }
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, messageId: agentMessage.id })}\n\n`))
              controller.close()
            },

            onError(error: Error) {
              updateMessage(agentMessage.id, {
                content: `Error: ${error.message}`,
                status: 'error',
              })

              emit('error', { messageId: agentMessage.id, error: error.message }, channelId)

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
              controller.close()
            },
          })
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error'
          updateMessage(agentMessage.id, { content: `Error: ${errMsg}`, status: 'error' })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Chat error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Process a swarm task: call the target agent and stream its response.
 */
async function processSwarmTask(taskId: string): Promise<void> {
  const { getNextQueuedTask, updateTaskStatus } = await import('@/lib/open-brain/db/swarm-tasks')

  const task = getNextQueuedTask()
  if (!task || task.id !== taskId) return

  updateTaskStatus(task.id, 'running')

  const agent = getAgentOrThrow(task.targetAgentId)
  const { provider, model } = resolveProvider(agent)

  // Create system message about the swarm
  const sourceAgent = task.sourceAgentId !== 'user'
    ? getAgentOrThrow(task.sourceAgentId as AgentId)
    : null

  createMessage({
    channelId: task.channelId,
    role: 'system',
    content: `${sourceAgent?.avatarEmoji || ''} ${sourceAgent?.shortName || 'User'} asked ${agent.avatarEmoji} ${agent.shortName} to help...`,
    status: 'complete',
  })

  emit('swarm:agent-responding', { task, agent: agent.id }, task.channelId)

  // Create placeholder for swarm response
  const swarmMessage = createMessage({
    channelId: task.channelId,
    role: 'agent',
    agentId: task.targetAgentId,
    content: '',
    status: 'streaming',
    inReplyToMessageId: task.triggerMessageId,
  })

  emit('message:new', swarmMessage, task.channelId)

  // Build conversation context
  const recentMessages = getMessagesByChannel(task.channelId, 20)
  const llmMessages: LLMMessage[] = recentMessages
    .filter(m => m.id !== swarmMessage.id)
    .map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.role === 'agent' && m.agentId
        ? `[${AGENTS.find(a => a.id === m.agentId)?.shortName || m.agentId}]: ${m.content}`
        : m.content,
    }))

  try {
    await provider.chat(llmMessages, agent.systemPrompt, model, {
      onToken(token: string) {
        emit('message:stream-chunk', { messageId: swarmMessage.id, token }, task.channelId)
      },

      onComplete(text: string, usage) {
        updateMessage(swarmMessage.id, { content: text, status: 'complete', tokenUsage: usage })
        updateTaskStatus(task.id, 'complete')

        emit('message:complete', {
          messageId: swarmMessage.id,
          content: text,
          agentId: task.targetAgentId,
        }, task.channelId)

        emit('swarm:complete', { task }, task.channelId)

        incrementUnread(task.channelId)

        // Check for further mentions (respect depth limit)
        const furtherMentions = parseMentions(text)
        for (const mentionedId of furtherMentions) {
          if (mentionedId !== task.targetAgentId && mentionedId !== task.sourceAgentId) {
            const newTask = createSwarmTask({
              triggerMessageId: swarmMessage.id,
              targetAgentId: mentionedId,
              sourceAgentId: task.targetAgentId,
              channelId: task.channelId,
              depth: task.depth + 1,
            })
            if (newTask) {
              processSwarmTask(newTask.id).catch(console.error)
            }
          }
        }
      },

      onError(error: Error) {
        updateMessage(swarmMessage.id, { content: `Error: ${error.message}`, status: 'error' })
        updateTaskStatus(task.id, 'failed')
      },
    })
  } catch (error) {
    updateTaskStatus(task.id, 'failed')
  }
}
