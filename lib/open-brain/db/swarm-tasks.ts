import { getDb } from './connection'
import { generateId } from '../utils/uuid'
import type { SwarmTask, SwarmTaskStatus, AgentId, ChannelId } from '../types'

const MAX_DEPTH = parseInt(process.env.OPEN_BRAIN_MAX_SWARM_DEPTH || '5', 10)

export function createSwarmTask(params: {
  triggerMessageId: string
  targetAgentId: AgentId
  sourceAgentId: AgentId | 'user'
  channelId: ChannelId
  depth: number
}): SwarmTask | null {
  if (params.depth >= MAX_DEPTH) return null

  const db = getDb()
  const id = generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO swarm_tasks (id, trigger_message_id, target_agent_id, source_agent_id, channel_id, status, depth, max_depth, created_at)
    VALUES (?, ?, ?, ?, ?, 'queued', ?, ?, ?)
  `).run(id, params.triggerMessageId, params.targetAgentId, params.sourceAgentId, params.channelId, params.depth, MAX_DEPTH, now)

  return {
    id,
    triggerMessageId: params.triggerMessageId,
    targetAgentId: params.targetAgentId,
    sourceAgentId: params.sourceAgentId,
    channelId: params.channelId,
    status: 'queued',
    depth: params.depth,
    maxDepth: MAX_DEPTH,
    createdAt: now,
  }
}

export function getNextQueuedTask(): SwarmTask | null {
  const db = getDb()
  const row = db.prepare(
    "SELECT * FROM swarm_tasks WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1"
  ).get() as Record<string, unknown> | undefined

  return row ? rowToSwarmTask(row) : null
}

export function updateTaskStatus(id: string, status: SwarmTaskStatus): void {
  const db = getDb()
  const completedAt = status === 'complete' || status === 'failed' ? new Date().toISOString() : null
  db.prepare('UPDATE swarm_tasks SET status = ?, completed_at = ? WHERE id = ?').run(status, completedAt, id)
}

function rowToSwarmTask(row: Record<string, unknown>): SwarmTask {
  return {
    id: row.id as string,
    triggerMessageId: row.trigger_message_id as string,
    targetAgentId: row.target_agent_id as AgentId,
    sourceAgentId: row.source_agent_id as string as AgentId | 'user',
    channelId: row.channel_id as string,
    status: row.status as SwarmTaskStatus,
    depth: row.depth as number,
    maxDepth: row.max_depth as number,
    createdAt: row.created_at as string,
    completedAt: (row.completed_at as string) || undefined,
  }
}
