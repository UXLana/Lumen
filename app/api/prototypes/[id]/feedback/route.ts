import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('prototype_feedback')
    .select('feedback, updated_at, updated_by')
    .eq('prototype_id', id)
    .single()

  if (error && error.code === 'PGRST116') {
    // Not found — return empty feedback array
    return NextResponse.json({ feedback: [] })
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    feedback: data.feedback,
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { entry, updatedBy } = await request.json()

  // Fetch existing feedback
  const { data: existing } = await supabase
    .from('prototype_feedback')
    .select('feedback')
    .eq('prototype_id', id)
    .single()

  const currentFeedback = existing?.feedback || []
  const updatedFeedback = [entry, ...currentFeedback]

  const { error } = await supabase
    .from('prototype_feedback')
    .upsert(
      {
        prototype_id: id,
        feedback: updatedFeedback,
        updated_by: updatedBy || null,
      },
      { onConflict: 'prototype_id' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, feedback: updatedFeedback })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { feedback, updatedBy } = await request.json()

  const { error } = await supabase
    .from('prototype_feedback')
    .upsert(
      {
        prototype_id: id,
        feedback,
        updated_by: updatedBy || null,
      },
      { onConflict: 'prototype_id' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
