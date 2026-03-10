import { subscribe } from './event-bus'
import type { SSEEvent } from '../types'

/**
 * Create a ReadableStream that sends SSE events to the client.
 * Used by the GET /api/open-brain/stream route.
 */
export function createSSEStream(): ReadableStream {
  let unsubscribe: (() => void) | null = null

  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send initial heartbeat
      controller.enqueue(encoder.encode(': heartbeat\n\n'))

      unsubscribe = subscribe((event: SSEEvent) => {
        try {
          const data = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch {
          // Client disconnected
        }
      })

      // Send periodic heartbeats to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000)
    },

    cancel() {
      if (unsubscribe) unsubscribe()
    },
  })
}
