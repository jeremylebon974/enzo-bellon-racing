export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const produits = lineItems.data.map((item: any) => ({
      name: item.description,
      quantity: item.quantity,
      price: (item.amount_total || 0) / 100,
    }))
    await supabase.from('commandes').insert([{
      client_prenom: session.shipping_details?.name?.split(' ')[0] || 'Client',
      client_email: session.customer_details?.email || '',
      client_adresse: session.shipping_details?.address
        ? `${session.shipping_details.address.line1}, ${session.shipping_details.address.city}, ${session.shipping_details.address.country}`
        : '',
      produits,
      total: (session.amount_total || 0) / 100,
      statut: 'en_attente',
    }])
  }

  return NextResponse.json({ received: true })
}