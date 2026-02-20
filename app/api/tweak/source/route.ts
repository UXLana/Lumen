import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

// POST /api/tweak/source — write full source to a component file
export async function POST(request: NextRequest) {
  try {
    const { componentPath, source } = await request.json()

    // Validate componentPath is within components/ directory
    const resolved = path.resolve(process.cwd(), componentPath)
    if (!resolved.startsWith(path.resolve(process.cwd(), 'components'))) {
      return NextResponse.json({ error: 'Invalid path — must be within components/' }, { status: 400 })
    }

    await writeFile(resolved, source, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
