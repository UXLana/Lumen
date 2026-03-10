import { getDb } from './connection'
import { getAllDefaultChannels } from '../channels/defaults'
import type { Channel, ChannelType, AgentId } from '../types'

/**
 * Seed default channels if they don't exist yet.
 */
export function seedChannels(): void {
  const db = getDb()
  const existing = db.prepare('SELECT COUNT(*) as count FROM channels').get() as { count: number }

  if (existing.count === 0) {
    const insert = db.prepare(`
      INSERT INTO channels (id, type, name, description, icon, agent_id, member_agent_ids, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const channels = getAllDefaultChannels()
    const tx = db.transaction(() => {
      for (const ch of channels) {
        insert.run(
          ch.id,
          ch.type,
          ch.name,
          ch.description || null,
          ch.icon || null,
          ch.agentId || null,
          JSON.stringify(ch.memberAgentIds),
          ch.createdAt
        )
      }
    })
    tx()
  }
}

export function listChannels(): Channel[] {
  const db = getDb()
  seedChannels()
  const rows = db.prepare('SELECT * FROM channels ORDER BY type DESC, name ASC').all() as Array<Record<string, unknown>>
  return rows.map(rowToChannel)
}

export function getChannel(id: string): Channel | undefined {
  const db = getDb()
  seedChannels()
  const row = db.prepare('SELECT * FROM channels WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? rowToChannel(row) : undefined
}

function rowToChannel(row: Record<string, unknown>): Channel {
  return {
    id: row.id as string,
    type: row.type as ChannelType,
    name: row.name as string,
    description: (row.description as string) || undefined,
    icon: (row.icon as string) || undefined,
    agentId: (row.agent_id as AgentId) || undefined,
    memberAgentIds: JSON.parse((row.member_agent_ids as string) || '[]'),
    createdAt: row.created_at as string,
    lastMessageAt: (row.last_message_at as string) || undefined,
  }
}
