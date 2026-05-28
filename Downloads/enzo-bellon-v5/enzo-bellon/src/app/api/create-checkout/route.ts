export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })

    const { items } = await req.json()

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [],
          description: item.size ? `Taille: ${item.size}` : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/panier?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/panier?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'RE', 'GP', 'MQ', 'GF', 'CA', 'US', 'GB', 'DE', 'ES', 'IT', 'PT', 'NL', 'AU', 'JP'],
      },
      customer_creation: 'always',
      tax_id_collection: { enabled: true },
      custom_fields: [
        {
          key: 'type_client',
          label: { type: 'custom', custom: 'Particulier ou Professionnel ?' },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Particulier', value: 'particulier' },
              { label: 'Professionnel', value: 'professionnel' },
            ],
          },
        },
        {
          key: 'nom_entreprise',
          label: { type: 'custom', custom: 'Nom entreprise (si professionnel)' },
          type: 'text',
          optional: true,
        },
        {
          key: 'instructions',
          label: { type: 'custom', custom: 'Instructions de livraison (optionnel)' },
          type: 'text',
          optional: true,
        },
      ],
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}