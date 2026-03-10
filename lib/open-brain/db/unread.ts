import { getDb } from './connection'
import type { UnreadState, ChannelId } from '../types'

export function getUnreadState(channelId: ChannelId): UnreadState {
  const db = getDb()
  const row = db.prepare('SELECT * FROM unread WHERE channel_id = ?').get(channelId) as Record<string, unknown> | undefined

  if (!row) {
    return { channelId, unreadCount: 0, hasAttention: false }
  }

  return {
    channelId: row.channel_id as string,
    unreadCount: row.unread_count as number,
    hasAttention: Boolean(row.has_attention),
    lastReadMessageId: (row.last_read_message_id as string) || undefined,
  }
}

export function getAllUnread(): UnreadState[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM unread WHERE unread_count > 0 OR has_attention = 1').all() as Array<Record<string, unknown>>

  return rows.map(row => ({
    channelId: row.channel_id as string,
    unreadCount: row.unread_count as number,
    hasAttention: Boolean(row.has_attention),
    lastReadMessageId: (row.last_read_message_id as string) || undefined,
  }))
}

export function incrementUnread(channelId: ChannelId, hasAttention = false): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO unread (channel_id, unread_count, has_attention)
    VALUES (?, 1, ?)
    ON CONFLICT(channel_id) DO UPDATE SET
      unread_count = unread_count + 1,
      has_attention = CASE WHEN ? = 1 THEN 1 ELSE has_attention END
  `).run(channelId, hasAttention ? 1 : 0, hasAttention ? 1 : 0)
}

export function markRead(channelId: ChannelId, lastReadMessageId: string): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO unread (channel_id, unread_count, has_attention, last_read_message_id)
    VALUES (?, 0, 0, ?)
    ON CONFLICT(channel_id) DO UPDATE SET
      unread_count = 0,
      has_attention = 0,
      last_read_message_id = ?
  `).run(channelId, lastReadMessageId, lastReadMessageId)
}
