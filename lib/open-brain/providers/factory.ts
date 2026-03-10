import type { AgentConfig, AIProvider, LLMProvider } from '../types'
import { anthropicProvider } from './anthropic'
import { openaiProvider } from './openai'
import { getDb } from '../db/connection'

const providers: Record<AIProvider, LLMProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
}

interface ResolvedProvider {
  provider: LLMProvider
  model: string
}

/**
 * Resolve the provider and model for an agent,
 * checking for user overrides in the database.
 */
export function resolveProvider(agent: AgentConfig): ResolvedProvider {
  const db = getDb()
  const override = db.prepare('SELECT provider, model FROM agent_config_overrides WHERE agent_id = ?')
    .get(agent.id) as { provider?: string; model?: string } | undefined

  const providerKey = (override?.provider as AIProvider) || agent.provider
  const model = override?.model || agent.model

  return {
    provider: providers[providerKey] || providers.anthropic,
    model,
  }
}
