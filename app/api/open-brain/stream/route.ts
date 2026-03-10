import { createSSEStream } from '@/lib/open-brain/sse/stream'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const stream = createSSEStream()

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
