import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider, LLMMessage, LLMStreamCallbacks } from '../types'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export const anthropicProvider: LLMProvider = {
  async chat(
    messages: LLMMessage[],
    systemPrompt: string,
    model: string,
    callbacks: LLMStreamCallbacks
  ): Promise<void> {
    const anthropic = getClient()

    // Convert messages to Anthropic format (system prompt is separate)
    const anthropicMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    try {
      const stream = anthropic.messages.stream({
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: anthropicMessages,
      })

      let fullText = ''

      stream.on('text', (text) => {
        fullText += text
        callbacks.onToken(text)
      })

      const finalMessage = await stream.finalMessage()

      callbacks.onComplete(fullText, {
        inputTokens: finalMessage.usage.input_tokens,
        outputTokens: finalMessage.usage.output_tokens,
      })
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)))
    }
  },
}
