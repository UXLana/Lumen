import type { Channel, AgentId } from '../types'
import { AGENTS } from '../agents/registry'

export const SHARED_CHANNELS: Channel[] = [
  {
    id: 'shared:general',
    type: 'shared',
    name: 'general',
    description: 'General discussion with all agents',
    icon: '#',
    memberAgentIds: AGENTS.map(a => a.id),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shared:design-system',
    type: 'shared',
    name: 'design-system',
    description: 'Components, tokens, themes, and architecture',
    icon: '\u{1F3A8}',
    memberAgentIds: AGENTS
      .filter(a => a.defaultChannels.includes('shared:design-system'))
      .map(a => a.id),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shared:accessibility',
    type: 'shared',
    name: 'accessibility',
    description: 'WCAG, Section 508, and ADA compliance',
    icon: '\u267F',
    memberAgentIds: [
      'design-accessibility',
      'component-generator',
      'design-system-builder',
    ] as AgentId[],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shared:strategy',
    type: 'shared',
    name: 'strategy',
    description: 'Design strategy, briefs, and planning',
    icon: '\u{1F4CB}',
    memberAgentIds: [
      'design-brief-generator',
      'design-lead-thought-partner',
      'ux-brief-generator',
      'notion-spec-to-implementation',
      'design-system-builder',
    ] as AgentId[],
    createdAt: new Date().toISOString(),
  },
]

export function generateDMChannels(): Channel[] {
  return AGENTS.map(agent => ({
    id: `dm:${agent.id}`,
    type: 'dm' as const,
    name: agent.shortName,
    description: `Direct messages with ${agent.name}`,
    icon: agent.avatarEmoji,
    agentId: agent.id,
    memberAgentIds: [agent.id],
    createdAt: new Date().toISOString(),
  }))
}

export function getAllDefaultChannels(): Channel[] {
  return [...SHARED_CHANNELS, ...generateDMChannels()]
}
