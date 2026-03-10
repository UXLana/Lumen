import { getDb } from './connection'
import { generateId } from '../utils/uuid'
import type { ContextEntry, AgentId, ChannelId } from '../types'

export function setContext(key: string, value: string, setBy: AgentId | 'user', channelId?: ChannelId): ContextEntry {
  const db = getDb()
  const id = generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO context (id, key, value, set_by, channel_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      set_by = excluded.set_by,
      channel_id = excluded.channel_id,
      updated_at = excluded.updated_at
  `).run(id, key, value, setBy, channelId || null, now, now)

  return { id, key, value, setBy, channelId: channelId || '', createdAt: now, updatedAt: now }
}

export function getContext(key: string): ContextEntry | undefined {
  const db = getDb()
  const row = db.prepare('SELECT * FROM context WHERE key = ?').get(key) as Record<string, unknown> | undefined
  return row ? rowToContext(row) : undefined
}

export function getAllContext(): ContextEntry[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM context ORDER BY updated_at DESC').all() as Array<Record<string, unknown>>
  return rows.map(rowToContext)
}

function rowToContext(row: Record<string, unknown>): ContextEntry {
  return {
    id: row.id as string,
    key: row.key as string,
    value: row.value as string,
    setBy: row.set_by as AgentId | 'user',
    channelId: (row.channel_id as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
