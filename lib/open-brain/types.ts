// =============================================================================
// Open Brain — Type Definitions
// =============================================================================

export type AgentId =
  | 'design-system-builder'
  | 'component-generator'
  | 'icon-generator'
  | 'design-system-librarian'
  | 'brand-tokens-translator'
  | 'figma-token-extractor'
  | 'theme-generator'
  | 'design-accessibility'
  | 'design-brief-generator'
  | 'design-lead-thought-partner'
  | 'frontend-design'
  | 'ux-brief-generator'
  | 'notion-spec-to-implementation'

export type AIProvider = 'anthropic' | 'openai'

export interface AgentConfig {
  id: AgentId
  name: string
  shortName: string
  description: string
  role: 'orchestrator' | 'specialist' | 'advisor'
  systemPrompt: string
  provider: AIProvider
  model: string
  avatarColor: string
  avatarEmoji: string
  capabilities: string[]
  canMention: AgentId[]
  defaultChannels: ChannelId[]
}

// ─── Channels ────────────────────────────────────────────────────────────────

export type ChannelType = 'dm' | 'shared'
export type ChannelId = string

export interface Channel {
  id: ChannelId
  type: ChannelType
  name: string
  description?: string
  icon?: string
  agentId?: AgentId
  memberAgentIds: AgentId[]
  createdAt: string
  lastMessageAt?: string
}

// ─── Messages ────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'agent' | 'system'
export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'error'

export interface Message {
  id: string
  channelId: ChannelId
  role: MessageRole
  agentId?: AgentId
  content: string
  mentions: AgentId[]
  inReplyToMessageId?: string
  status: MessageStatus
  needsAttention: boolean
  createdAt: string
  updatedAt?: string
  tokenUsage?: { inputTokens: number; outputTokens: number }
}

// ─── Shared Context ──────────────────────────────────────────────────────────

export interface ContextEntry {
  id: string
  key: string
  value: string
  setBy: AgentId | 'user'
  channelId: ChannelId
  createdAt: string
  updatedAt: string
}

// ─── Swarm Tasks ─────────────────────────────────────────────────────────────

export type SwarmTaskStatus = 'queued' | 'running' | 'complete' | 'failed'

export interface SwarmTask {
  id: string
  triggerMessageId: string
  targetAgentId: AgentId
  sourceAgentId: AgentId | 'user'
  channelId: ChannelId
  status: SwarmTaskStatus
  depth: number
  maxDepth: number
  createdAt: string
  completedAt?: string
}

// ─── Unread ──────────────────────────────────────────────────────────────────

export interface UnreadState {
  channelId: ChannelId
  unreadCount: number
  hasAttention: boolean
  lastReadMessageId?: string
}

// ─── SSE ─────────────────────────────────────────────────────────────────────

export type SSEEventType =
  | 'message:new'
  | 'message:update'
  | 'message:stream-chunk'
  | 'message:complete'
  | 'swarm:started'
  | 'swarm:agent-responding'
  | 'swarm:complete'
  | 'channel:updated'
  | 'attention:new'
  | 'error'

export interface SSEEvent {
  type: SSEEventType
  data: unknown
  channelId?: ChannelId
  timestamp: string
}

// ─── Provider Interface ──────────────────────────────────────────────────────

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LLMStreamCallbacks {
  onToken: (token: string) => void
  onComplete: (fullText: string, usage?: { inputTokens: number; outputTokens: number }) => void
  onError: (error: Error) => void
}

export interface LLMProvider {
  chat(
    messages: LLMMessage[],
    systemPrompt: string,
    model: string,
    callbacks: LLMStreamCallbacks
  ): Promise<void>
}
