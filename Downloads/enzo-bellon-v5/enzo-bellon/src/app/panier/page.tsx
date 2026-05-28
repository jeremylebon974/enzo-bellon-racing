'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { trackCheckoutStart } from '@/lib/tracker'

function PanierContent() {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const handleCheckout = async () => {
    trackCheckoutStart()
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erreur checkout:', error)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="section-tag mb-3 block">Mon Panier</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(48px,7vw,80px)', lineHeight: 0.9 }}>
            <span className="text-white">MON </span>
            <span style={{ color: 'var(--orange)' }}>PANIER</span>
          </h1>
          {count > 0 && (
            <p className="mt-3 text-sm" style={{ color: 'rgba(245,245,245,0.5)' }}>
              {count} article{count > 1 ? 's' : ''} — {total.toFixed(2)} €
            </p>
          )}
        </div>

        {success && (
          <div className="mb-8 p-5" style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)' }}>
            <div className="font-bold text-lg mb-1" style={{ color: '#00c864' }}>✓ Commande confirmée !</div>
            <p className="text-sm" style={{ color: 'rgba(245,245,245,0.6)' }}>Merci pour votre achat. Vous recevrez un email de confirmation.</p>
          </div>
        )}
        {canceled && (
          <div className="mb-8 p-5" style={{ background: 'rgba(255,90,0,0.1)', border: '1px solid rgba(255,90,0,0.3)' }}>
            <div className="font-bold text-lg mb-1" style={{ color: 'var(--orange)' }}>Paiement annulé</div>
            <p className="text-sm" style={{ color: 'rgba(245,245,245,0.6)' }}>Votre commande n'a pas été traitée.</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🛒</div>
            <div className="font-display text-3xl text-white mb-4">PANIER VIDE</div>
            <p className="text-sm mb-8" style={{ color: 'rgba(245,245,245,0.4)' }}>Découvrez la collection officielle Fasty Foxy N°33</p>
            <Link href="/#boutique" className="btn-primary">Voir la boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-5 p-5"
                  style={{ background: 'var(--carbon)', border: '1px solid rgba(255,90,0,0.08)' }}>
                  <div className="relative flex-shrink-0" style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.03)' }}>
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-2" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--white)' }}>{item.name}</div>
                    <div className="font-condensed text-xs uppercase mb-1" style={{ color: 'var(--orange)' }}>{item.category}</div>
                    {item.size && (
                      <div className="text-xs mb-3" style={{ color: 'rgba(245,245,245,0.5)' }}>
                        Taille : <strong style={{ color: 'white' }}>{item.size}</strong>
                      </div>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-lg"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>−</button>
                        <span className="font-bold text-white w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-lg"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>+</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display text-xl" style={{ color: 'var(--orange)' }}>{(item.price * item.quantity).toFixed(2)} €</div>
                        <button onClick={() => removeItem(item.id, item.size)}
                          className="text-xs uppercase tracking-wider px-3 py-1 transition-all"
                          style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(245,245,245,0.3)', border: '1px solid rgba(255,255,255,0.08)', background: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ff5050'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,245,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart}
                className="text-xs uppercase tracking-wider px-4 py-2 mt-2"
                style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(245,245,245,0.3)', border: '1px solid rgba(255,255,255,0.06)', background: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>
                Vider le panier
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6" style={{ background: 'var(--carbon)', border: '1px solid rgba(255,90,0,0.1)' }}>
                <div className="font-display text-xl text-white mb-6">RÉCAPITULATIF</div>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                      <span style={{ color: 'rgba(245,245,245,0.6)' }}>{item.name} {item.size && `(${item.size})`} × {item.quantity}</span>
                      <span className="text-white">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mb-6" style={{ borderTop: '1px solid rgba(255,90,0,0.1)' }}>
                  <div className="flex justify-between items-center">
                    <span className="font-condensed text-sm uppercase tracking-wider" style={{ color: 'rgba(245,245,245,0.6)' }}>Total</span>
                    <span className="font-display text-2xl" style={{ color: 'var(--orange)' }}>{total.toFixed(2)} €</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'rgba(245,245,245,0.3)' }}>Livraison calculée à l'étape suivante</p>
                </div>
                <button onClick={handleCheckout} disabled={loading}
                  className="btn-primary w-full justify-center text-sm py-4"
                  style={{ display: 'flex', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⏳ Redirection...' : '🔒 Passer la commande'}
                </button>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,245,0.3)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <p className="text-xs" style={{ color: 'rgba(245,245,245,0.3)' }}>Paiement sécurisé via Stripe</p>
                </div>
                <Link href="/#boutique" className="block text-center text-xs mt-3 transition-colors"
                  style={{ color: 'rgba(245,245,245,0.4)', letterSpacing: '0.1em' }}>
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function PanierPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--black)' }} />}>
        <PanierContent />
      </Suspense>
      <Footer />
    </>
  )
}