export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const body = await req.json()
    const { type, visitor_id, session_id, page, product_id, metadata } = body

    // Enregistre l'événement
    await supabase.from('events').insert([{
      type,
      visitor_id,
      session_id,
      page,
      product_id: product_id || null,
      metadata: metadata || {},
    }])

    // Upsert session
    await supabase.from('sessions').upsert([{
      id: session_id,
      visitor_id,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      pages_viewed: type === 'page_view' ? 1 : 0,
      scroll_depth: metadata?.depth || 0,
      converted: type === 'purchase',
    }], { onConflict: 'id', ignoreDuplicates: false })

    // Calcule et met à jour le score d'intention
    const { data: events } = await supabase
      .from('events')
      .select('type')
      .eq('visitor_id', visitor_id)

    if (events) {
      let score = 0
      events.forEach(e => {
        if (e.type === 'page_view') score += 2
        if (e.type === 'product_view') score += 10
        if (e.type === 'add_to_cart') score += 25
        if (e.type === 'checkout_start') score += 40
        if (e.type === 'purchase') score += 100
      })
      score = Math.min(score, 100)

      let level = 'froid'
      if (score >= 10) level = 'curieux'
      if (score >= 25) level = 'engagé'
      if (score >= 50) level = 'chaud'
      if (score >= 75) level = 'acheteur'
      if (events.filter(e => e.type === 'purchase').length >= 2) level = 'fidèle'

      await supabase.from('visitor_scores').upsert([{
        visitor_id,
        score,
        level,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }], { onConflict: 'visitor_id' })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}