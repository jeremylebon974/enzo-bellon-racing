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

    const shipping = session.shipping_details?.address
    const billing = session.customer_details?.address

    const customFields = session.custom_fields || []
    const typeClient = customFields.find((f: any) => f.key === 'type_client')?.dropdown?.value || 'particulier'
    const nomEntreprise = customFields.find((f: any) => f.key === 'nom_entreprise')?.text?.value || ''
    const instructions = customFields.find((f: any) => f.key === 'instructions')?.text?.value || ''

    await supabase.from('commandes').insert([{
      client_prenom: session.shipping_details?.name?.split(' ')[0] || session.customer_details?.name?.split(' ')[0] || 'Client',
      client_nom: session.shipping_details?.name?.split(' ').slice(1).join(' ') || '',
      client_email: session.customer_details?.email || '',
      client_telephone: session.customer_details?.phone || '',
      client_type: typeClient,
      client_entreprise: nomEntreprise,
      client_adresse: shipping
        ? `${shipping.line1}${shipping.line2 ? ', ' + shipping.line2 : ''}, ${shipping.postal_code} ${shipping.city}, ${shipping.country}`
        : '',
      client_adresse_facturation: billing
        ? `${billing.line1}${billing.line2 ? ', ' + billing.line2 : ''}, ${billing.postal_code} ${billing.city}, ${billing.country}`
        : '',
      instructions_livraison: instructions,
      produits,
      total: (session.amount_total || 0) / 100,
      stripe_session_id: session.id,
      stripe_customer_id: session.customer || '',
      statut: 'en_attente',
    }])
  }

  return NextResponse.json({ received: true })
}