import OpenAI from 'openai'
import type { LLMProvider, LLMMessage, LLMStreamCallbacks } from '../types'

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

export const openaiProvider: LLMProvider = {
  async chat(
    messages: LLMMessage[],
    systemPrompt: string,
    model: string,
    callbacks: LLMStreamCallbacks
  ): Promise<void> {
    const openai = getClient()

    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
    ]

    try {
      const stream = await openai.chat.completions.create({
        model,
        messages: openaiMessages,
        max_tokens: 4096,
        stream: true,
      })

      let fullText = ''
      let promptTokens = 0
      let completionTokens = 0

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          fullText += delta
          callbacks.onToken(delta)
        }
        if (chunk.usage) {
          promptTokens = chunk.usage.prompt_tokens
          completionTokens = chunk.usage.completion_tokens
        }
      }

      callbacks.onComplete(fullText, {
        inputTokens: promptTokens,
        outputTokens: completionTokens,
      })
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)))
    }
  },
}
