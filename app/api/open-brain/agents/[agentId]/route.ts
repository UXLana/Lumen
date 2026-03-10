import { NextRequest, NextResponse } from 'next/server'
import { getAgentOrThrow } from '@/lib/open-brain/agents/registry'
import { getDb } from '@/lib/open-brain/db/connection'
import type { AgentId } from '@/lib/open-brain/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params
    const agent = getAgentOrThrow(agentId as AgentId)
    return NextResponse.json(agent)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Agent not found' },
      { status: 404 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params
    const body = await request.json()
    const { provider, model } = body

    const db = getDb()
    db.prepare(`
      INSERT INTO agent_config_overrides (agent_id, provider, model, updated_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(agent_id) DO UPDATE SET
        provider = COALESCE(excluded.provider, provider),
        model = COALESCE(excluded.model, model),
        updated_at = datetime('now')
    `).run(agentId, provider || null, model || null)

    return NextResponse.json({ success: true, agentId, provider, model })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update agent' },
      { status: 500 }
    )
  }
}
