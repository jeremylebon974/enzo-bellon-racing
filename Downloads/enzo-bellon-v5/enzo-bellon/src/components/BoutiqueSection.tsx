'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Product = {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  active: boolean
}

const categoryLabels: Record<string, string> = {
  casquette: 'Casquette',
  tshirt: 'T-Shirt',
  sweat: 'Sweat',
  ecusson: 'Ecusson brodé',
}

const categoryFilters = [
  { id: 'all', label: 'Tout voir' },
  { id: 'casquette', label: 'Casquettes' },
  { id: 'tshirt', label: 'T-Shirts' },
  { id: 'sweat', label: 'Sweats' },
  { id: 'ecusson', label: 'Ecussons' },
]

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--carbon)',
        border: `1px solid ${hovered ? 'rgba(255,90,0,0.35)' : 'rgba(255,90,0,0.07)'}`,
        transition: 'border-color 0.3s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.02)' }}>
        {product.image ? (
          <Image src={product.image} alt={product.name} fill
            className="object-contain p-5 transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '48px' }}>🏷️</div>
        )}
        <div className="absolute inset-0 flex items-end justify-center pb-4 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0, background: 'linear-gradient(to top,rgba(10,10,10,0.65) 0%,transparent 60%)' }}>
          <span className="font-bold text-xs tracking-widest uppercase px-5 py-2"
            style={{ fontFamily: 'var(--font-condensed)', background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,90,0,0.4)', color: 'var(--white)', letterSpacing: '0.15em' }}>
            Voir le produit
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-bold text-xs tracking-widest uppercase mb-1"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.2em' }}>
          {categoryLabels[product.category] || product.category}
        </div>
        <h3 className="font-bold text-base mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--white)' }}>
          {product.name}
        </h3>
        <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: 'rgba(245,245,245,0.4)' }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-2xl" style={{ color: 'var(--white)' }}>
            {Number(product.price).toFixed(2).replace('.', ',')} €
          </span>
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1500) }}
            className="font-bold text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200"
            style={{
              fontFamily: 'var(--font-condensed)',
              background: added ? 'rgba(255,90,0,0.12)' : 'linear-gradient(135deg,#FF3300,#FF5A00)',
              color: added ? 'var(--orange)' : '#fff',
              border: added ? '1px solid rgba(255,90,0,0.4)' : 'none',
              clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}>
            {added ? '✓ Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BoutiqueSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('produits')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)

  return (
    <section id="boutique" className="relative" style={{ background: 'var(--dark)' }}>
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="font-bold text-xs tracking-widest uppercase mb-3"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.25em' }}>
                Boutique Officielle
              </div>
              <h2 className="font-display leading-none" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
                <span className="text-white">TOUTE LA </span>
                <span style={{ color: 'var(--orange)' }}>COLLECTION</span>
              </h2>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categoryFilters.map(cat => {
              const active = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="font-bold text-xs tracking-widest uppercase px-5 py-2 transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.15em',
                    background: active ? 'linear-gradient(135deg,#FF3300,#FF5A00)' : 'transparent',
                    color: active ? '#fff' : 'rgba(245,245,245,0.5)',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    clipPath: active ? 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' : 'none',
                    cursor: 'pointer',
                  }}>
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Grille */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
              Aucun produit disponible pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,90,0,0.04)' }}>
              {filtered.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          {/* Garanties */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(255,90,0,0.06)' }}>
            {[
              { icon: '📦', title: 'Livraison mondiale', desc: 'Expédition internationale disponible' },
              { icon: '✅', title: 'Qualité premium', desc: 'Broderies & impressions haute définition' },
              { icon: '🏁', title: 'Edition officielle', desc: 'Produits officiels Fasty Foxy N°33' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-4 p-6" style={{ background: 'var(--carbon)' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-bold text-sm mb-0.5" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--white)' }}>{item.title}</div>
                  <div className="text-xs" style={{ color: 'rgba(245,245,245,0.4)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}