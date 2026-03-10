import { NextResponse } from 'next/server'
import { listChannels } from '@/lib/open-brain/db/channels'
import { getAllUnread } from '@/lib/open-brain/db/unread'

export async function GET() {
  try {
    const channels = listChannels()
    const unreads = getAllUnread()
    const unreadMap = Object.fromEntries(unreads.map(u => [u.channelId, u]))

    const withUnread = channels.map(ch => ({
      ...ch,
      unreadCount: unreadMap[ch.id]?.unreadCount || 0,
      hasAttention: unreadMap[ch.id]?.hasAttention || false,
    }))

    return NextResponse.json(withUnread)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list channels' },
      { status: 500 }
    )
  }
}
