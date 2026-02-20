import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// GET /api/tweak/read?path=components/Badge/Badge.tsx
export async function GET(request: NextRequest) {
  try {
    const componentPath = request.nextUrl.searchParams.get('path')
    if (!componentPath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
    }

    const resolved = path.resolve(process.cwd(), componentPath)
    if (!resolved.startsWith(path.resolve(process.cwd(), 'components'))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const source = await readFile(resolved, 'utf-8')
    return NextResponse.json({ source })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
