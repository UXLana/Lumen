import { EventEmitter } from 'events'
import type { SSEEvent, SSEEventType, ChannelId } from '../types'

// Singleton event bus for SSE
const emitter = new EventEmitter()
emitter.setMaxListeners(100)

export function emit(type: SSEEventType, data: unknown, channelId?: ChannelId): void {
  const event: SSEEvent = {
    type,
    data,
    channelId,
    timestamp: new Date().toISOString(),
  }
  emitter.emit('sse', event)
}

export function subscribe(listener: (event: SSEEvent) => void): () => void {
  emitter.on('sse', listener)
  return () => emitter.off('sse', listener)
}

export { emitter }
