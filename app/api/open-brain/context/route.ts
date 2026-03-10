import { NextRequest, NextResponse } from 'next/server'
import { setContext, getContext, getAllContext } from '@/lib/open-brain/db/context'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      const entry = getContext(key)
      if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(entry)
    }

    return NextResponse.json(getAllContext())
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get context' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, setBy = 'user', channelId } = await request.json()
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value required' }, { status: 400 })
    }

    const entry = setContext(key, typeof value === 'string' ? value : JSON.stringify(value), setBy, channelId)
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to set context' },
      { status: 500 }
    )
  }
}
