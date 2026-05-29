'use client'
import Image from 'next/image'
import { useState } from 'react'

const rounds = [
  { num: 1, name: 'Barcelona', circuit: 'Circuit de Barcelona-Catalunya', country: 'ES', date: '24 Mai 2026', status: 'termine', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045010/round_1_xzpb2m.jpg' },
  { num: 2, name: 'Estoril', circuit: 'Circuito do Estoril', country: 'PT', date: '14 Juin 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045015/round_2_cuythp.jpg' },
  { num: 3, name: 'Jerez', circuit: 'Circuito de Jerez – Angel Nieto', country: 'ES', date: '5 Juillet 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045026/round_3_ecpmoz.jpg' },
  { num: 4, name: 'Magny-Cours', circuit: 'Circuit de Nevers Magny-Cours', country: 'FR', date: '26 Juillet 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045049/Round_4_glnmbt.jpg' },
  { num: 5, name: 'Ricardo Tormo', circuit: 'Circuit Ricardo Tormo', country: 'ES', date: '6 Septembre 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045044/round_5_hsankv.jpg' },
  { num: 6, name: 'Aragon', circuit: 'Motorland Aragon', country: 'ES', date: '27 Septembre 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045036/round_6_fxtwhl.jpg' },
  { num: 7, name: 'Misano', circuit: 'Motor Valley – Misano', country: 'IT', date: '18 Octobre 2026', status: 'a_venir', img: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780045018/round_7_tnbilo.jpg' },
]

export default function SaisonSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const termine = rounds.filter(r => r.status === 'termine').length

  return (
    <section id="saison" style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,90,0,0.08)' }}>
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="font-bold text-xs tracking-widest uppercase mb-3"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.25em' }}>
                Compétition
              </div>
              <h2 className="font-display leading-none" style={{ fontSize: 'clamp(40px,6vw,72px)' }}>
                <span className="text-white">SAISON </span>
                <span style={{ color: 'var(--orange)' }}>FIM 2026</span>
              </h2>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Points', value: '0' },
                { label: 'Rounds disputés', value: `${termine}` },
                { label: 'Rounds total', value: '7' },
              ].map(s => (
                <div key={s.label} className="text-center px-5 py-3"
                  style={{ border: '1px solid rgba(255,90,0,0.2)', background: 'rgba(255,90,0,0.04)' }}>
                  <div className="font-display text-2xl" style={{ color: 'var(--orange)' }}>{s.value}</div>
                  <div className="text-xs uppercase tracking-wider mt-1"
                    style={{ fontFamily: 'var(--font-condensed)', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.1em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid rounds */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rounds.map(r => (
              <div key={r.num}
                className="relative overflow-hidden cursor-pointer group"
                style={{
                  aspectRatio: '4/5',
                  border: selected === r.num ? '2px solid var(--orange)' : '1px solid rgba(255,90,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setSelected(selected === r.num ? null : r.num)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,90,0,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = selected === r.num ? 'var(--orange)' : 'rgba(255,90,0,0.1)'}
              >
                {/* Image */}
                <Image
                  src={r.img}
                  alt={r.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <span className="font-display text-xs px-2 py-1"
                    style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--orange)', border: '1px solid rgba(255,90,0,0.3)' }}>
                    R{r.num}
                  </span>
                  <span className="font-bold text-xs px-2 py-1"
                    style={{ background: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em' }}>
                    {r.country}
                  </span>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2">
                  <span className="font-bold text-xs px-3 py-1"
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      letterSpacing: '0.1em',
                      background: r.status === 'termine' ? 'rgba(0,200,100,0.2)' : 'rgba(255,255,255,0.1)',
                      color: r.status === 'termine' ? '#00c864' : 'rgba(255,255,255,0.6)',
                      border: `1px solid ${r.status === 'termine' ? 'rgba(0,200,100,0.4)' : 'rgba(255,255,255,0.15)'}`,
                    }}>
                    {r.status === 'termine' ? 'TERMINÉ' : 'À VENIR'}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-display text-lg leading-tight text-white mb-1">{r.name.toUpperCase()}</div>
                  <div className="text-xs mb-2"
                    style={{ color: 'rgba(245,245,245,0.5)', fontFamily: 'var(--font-condensed)' }}>
                    {r.date}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(245,245,245,0.3)', fontFamily: 'var(--font-condensed)' }}>
                    {r.status === 'termine' ? 'Résultat à venir' : 'Résultat à venir'}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}