import { NextRequest, NextResponse } from 'next/server'
import { createMessage, getMessagesByChannel } from '@/lib/open-brain/db/messages'
import { incrementUnread } from '@/lib/open-brain/db/unread'
import { emit } from '@/lib/open-brain/sse/event-bus'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')
    if (!channelId) {
      return NextResponse.json({ error: 'channelId required' }, { status: 400 })
    }

    const before = searchParams.get('before') || undefined
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const messages = getMessagesByChannel(channelId, limit, before)

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { channelId, content, role = 'user', agentId, mentions = [] } = body

    if (!channelId || !content) {
      return NextResponse.json({ error: 'channelId and content required' }, { status: 400 })
    }

    const message = createMessage({
      channelId,
      role,
      agentId,
      content,
      mentions,
      status: 'complete',
    })

    // Emit SSE event
    emit('message:new', message, channelId)

    // Increment unread for other channels viewers
    incrementUnread(channelId)

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create message' },
      { status: 500 }
    )
  }
}
