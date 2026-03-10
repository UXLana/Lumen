import { NextResponse } from 'next/server'
import { AGENTS } from '@/lib/open-brain/agents/registry'
import { getDb } from '@/lib/open-brain/db/connection'

export async function GET() {
  try {
    const db = getDb()
    const overrides = db.prepare('SELECT * FROM agent_config_overrides').all() as Array<{ agent_id: string; provider: string; model: string }>
    const overrideMap = Object.fromEntries(overrides.map(o => [o.agent_id, o]))

    const agents = AGENTS.map(agent => ({
      ...agent,
      provider: overrideMap[agent.id]?.provider || agent.provider,
      model: overrideMap[agent.id]?.model || agent.model,
    }))

    return NextResponse.json(agents)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list agents' },
      { status: 500 }
    )
  }
}
