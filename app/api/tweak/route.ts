import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

// POST /api/tweak — apply style tweaks to a component file
// Supports both exact string and regex-based replacements
export async function POST(request: NextRequest) {
  try {
    const { componentPath, tweaks } = await request.json()

    // Validate componentPath is within components/ directory
    const resolved = path.resolve(process.cwd(), componentPath)
    if (!resolved.startsWith(path.resolve(process.cwd(), 'components'))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    let source = await readFile(resolved, 'utf-8')

    for (const tweak of tweaks) {
      const { pattern, replace, find } = tweak

      if (pattern) {
        // Regex-based replacement
        const regex = new RegExp(pattern, 'g')
        const newSource = source.replace(regex, replace)
        if (newSource === source) {
          return NextResponse.json(
            { error: `Pattern did not match: ${pattern}` },
            { status: 400 }
          )
        }
        source = newSource
      } else if (find) {
        // Exact string replacement
        if (!source.includes(find)) {
          return NextResponse.json(
            { error: `Could not find: ${find}` },
            { status: 400 }
          )
        }
        source = source.replace(find, replace)
      }
    }

    await writeFile(resolved, source, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
