import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('prototype_context')
    .select('context, updated_at, updated_by')
    .eq('prototype_id', id)
    .single()

  if (error && error.code === 'PGRST116') {
    // Not found — return null context
    return NextResponse.json({ context: null })
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    context: data.context,
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { context, updatedBy } = await request.json()

  const { error } = await supabase
    .from('prototype_context')
    .upsert(
      {
        prototype_id: id,
        context,
        updated_by: updatedBy || null,
      },
      { onConflict: 'prototype_id' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
