'use client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function MiniCart() {
  const { items, removeItem, updateQuantity, total, count, isOpen, setIsOpen } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
        onClick={() => setIsOpen(false)} />

      <div className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{ width: '100%', maxWidth: '420px', background: 'var(--carbon)', borderLeft: '1px solid rgba(255,90,0,0.15)', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,90,0,0.1)' }}>
          <div>
            <div className="font-display text-xl text-white">PANIER</div>
            <div className="font-condensed text-xs" style={{ color: 'var(--orange)', letterSpacing: '0.15em' }}>
              {count} article{count > 1 ? 's' : ''}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,245,0.6)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,90,0,0.15)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(245,245,245,0.6)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="text-5xl mb-4">🛒</div>
              <div className="font-display text-xl text-white mb-2">PANIER VIDE</div>
              <p className="text-sm" style={{ color: 'rgba(245,245,245,0.4)' }}>Ajoutez des articles depuis la boutique</p>
              <button onClick={() => setIsOpen(false)} className="btn-primary mt-6 text-xs py-2 px-6">Voir la boutique</button>
            </div>
          ) : items.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="relative flex-shrink-0" style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.04)' }}>
                {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm leading-tight mb-1 truncate" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--white)' }}>{item.name}</div>
                {item.size && <div className="text-xs mb-2" style={{ color: 'var(--orange)' }}>Taille : {item.size}</div>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>−</button>
                    <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-sm"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>+</button>
                  </div>
                  <div className="font-display text-lg" style={{ color: 'var(--orange)' }}>{(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id, item.size)} className="flex-shrink-0 self-start mt-1"
                style={{ color: 'rgba(245,245,245,0.3)', cursor: 'pointer', background: 'none', border: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff5050'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,245,245,0.3)'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,90,0,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-condensed text-sm tracking-wider uppercase" style={{ color: 'rgba(245,245,245,0.6)' }}>Total</span>
              <span className="font-display text-2xl text-white">{total.toFixed(2)} €</span>
            </div>
            <Link href="/panier" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center justify-center text-sm py-3" style={{ display: 'flex' }}>
              Voir le panier
            </Link>
            <p className="text-xs text-center mt-3" style={{ color: 'rgba(245,245,245,0.3)' }}>Livraison calculée à la commande</p>
          </div>
        )}
      </div>
    </>
  )
}