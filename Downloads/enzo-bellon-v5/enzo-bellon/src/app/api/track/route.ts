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

    // Gestion session
    const { data: existing } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .maybeSingle()

    if (existing) {
      await supabase.from('sessions').update({
        ended_at: new Date().toISOString(),
        pages_viewed: type === 'page_view' ? (existing.pages_viewed || 0) + 1 : (existing.pages_viewed || 0),
        scroll_depth: metadata?.depth ? Math.max(existing.scroll_depth || 0, metadata.depth) : (existing.scroll_depth || 0),
        converted: type === 'purchase' ? true : (existing.converted || false),
      }).eq('id', session_id)
    } else {
      await supabase.from('sessions').insert([{
        id: session_id,
        visitor_id,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        pages_viewed: type === 'page_view' ? 1 : 0,
        scroll_depth: metadata?.depth || 0,
        converted: type === 'purchase',
      }])
    }

    // Score intention d'achat
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