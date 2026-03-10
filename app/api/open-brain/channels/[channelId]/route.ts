import { NextRequest, NextResponse } from 'next/server'
import { getChannel } from '@/lib/open-brain/db/channels'
import { getMessagesByChannel } from '@/lib/open-brain/db/messages'
import { markRead } from '@/lib/open-brain/db/unread'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params
    const channel = getChannel(channelId)
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const before = searchParams.get('before') || undefined
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const messages = getMessagesByChannel(channelId, limit, before)

    // Mark channel as read
    if (messages.length > 0) {
      markRead(channelId, messages[messages.length - 1].id)
    }

    return NextResponse.json({ channel, messages })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get channel' },
      { status: 500 }
    )
  }
}
