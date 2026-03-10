import type { AgentId } from '../types'
import { AGENT_IDS } from '../agents/registry'

const MENTION_REGEX = /@([\w-]+)/g

/**
 * Extract valid agent @mentions from message text.
 * Returns unique list of AgentIds found.
 */
export function parseMentions(text: string): AgentId[] {
  const mentions: AgentId[] = []
  let match: RegExpExecArray | null

  while ((match = MENTION_REGEX.exec(text)) !== null) {
    const candidate = match[1] as AgentId
    if (AGENT_IDS.includes(candidate) && !mentions.includes(candidate)) {
      mentions.push(candidate)
    }
  }

  return mentions
}

/**
 * Format an agent ID as a display mention: @Builder
 */
export function formatMention(agentId: AgentId, shortName: string): string {
  return `@${shortName}`
}
