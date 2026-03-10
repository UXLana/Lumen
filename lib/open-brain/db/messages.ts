import { getDb } from './connection'
import { generateId } from '../utils/uuid'
import type { Message, MessageRole, MessageStatus, AgentId, ChannelId } from '../types'

interface CreateMessageParams {
  channelId: ChannelId
  role: MessageRole
  agentId?: AgentId
  content: string
  mentions?: AgentId[]
  inReplyToMessageId?: string
  status?: MessageStatus
  needsAttention?: boolean
}

export function createMessage(params: CreateMessageParams): Message {
  const db = getDb()
  const id = generateId()
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO messages (id, channel_id, role, agent_id, content, mentions, in_reply_to_message_id, status, needs_attention, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id,
    params.channelId,
    params.role,
    params.agentId || null,
    params.content,
    JSON.stringify(params.mentions || []),
    params.inReplyToMessageId || null,
    params.status || 'complete',
    params.needsAttention ? 1 : 0,
    now
  )

  // Update channel last_message_at
  db.prepare('UPDATE channels SET last_message_at = ? WHERE id = ?')
    .run(now, params.channelId)

  return {
    id,
    channelId: params.channelId,
    role: params.role,
    agentId: params.agentId,
    content: params.content,
    mentions: params.mentions || [],
    inReplyToMessageId: params.inReplyToMessageId,
    status: params.status || 'complete',
    needsAttention: params.needsAttention || false,
    createdAt: now,
  }
}

export function updateMessage(id: string, updates: Partial<Pick<Message, 'content' | 'status' | 'needsAttention'>> & { tokenUsage?: { inputTokens: number; outputTokens: number } }): void {
  const db = getDb()
  const now = new Date().toISOString()
  const sets: string[] = ['updated_at = ?']
  const values: unknown[] = [now]

  if (updates.content !== undefined) {
    sets.push('content = ?')
    values.push(updates.content)
  }
  if (updates.status !== undefined) {
    sets.push('status = ?')
    values.push(updates.status)
  }
  if (updates.needsAttention !== undefined) {
    sets.push('needs_attention = ?')
    values.push(updates.needsAttention ? 1 : 0)
  }
  if (updates.tokenUsage) {
    sets.push('token_input = ?, token_output = ?')
    values.push(updates.tokenUsage.inputTokens, updates.tokenUsage.outputTokens)
  }

  values.push(id)
  db.prepare(`UPDATE messages SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

export function getMessagesByChannel(channelId: ChannelId, limit = 50, before?: string): Message[] {
  const db = getDb()
  let query = 'SELECT * FROM messages WHERE channel_id = ?'
  const params: unknown[] = [channelId]

  if (before) {
    query += ' AND created_at < ?'
    params.push(before)
  }

  query += ' ORDER BY created_at DESC LIMIT ?'
  params.push(limit)

  const rows = db.prepare(query).all(...params) as Array<Record<string, unknown>>

  return rows.map(rowToMessage).reverse()
}

export function getMessage(id: string): Message | undefined {
  const db = getDb()
  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? rowToMessage(row) : undefined
}

function rowToMessage(row: Record<string, unknown>): Message {
  return {
    id: row.id as string,
    channelId: row.channel_id as string,
    role: row.role as MessageRole,
    agentId: (row.agent_id as AgentId) || undefined,
    content: row.content as string,
    mentions: JSON.parse((row.mentions as string) || '[]'),
    inReplyToMessageId: (row.in_reply_to_message_id as string) || undefined,
    status: row.status as MessageStatus,
    needsAttention: Boolean(row.needs_attention),
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string) || undefined,
    tokenUsage: row.token_input != null
      ? { inputTokens: row.token_input as number, outputTokens: row.token_output as number }
      : undefined,
  }
}
