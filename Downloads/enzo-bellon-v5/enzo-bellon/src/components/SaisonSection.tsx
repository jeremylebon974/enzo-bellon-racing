'use client'
import Image from 'next/image'
import { season2025 } from '@/data/data'

export default function SaisonSection() {
  const totalPoints = season2025
    .filter((r) => r.points !== null)
    .reduce((sum, r) => sum + (r.points || 0), 0)

  return (
    <section
      id="saison"
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--carbon)' }}
    >
      {/* Background grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,90,0,0.03) 1px, transparent 1px)',
          backgroundSize: '100% 80px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="section-tag mb-3 block">Compétition</span>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: 0.9 }}
            >
              <span className="text-white">SAISON</span>
              <br />
              <span style={{ color: 'var(--orange)' }}>FIM 2026</span>
            </h2>
          </div>

          {/* Season summary */}
          <div className="flex gap-6">
            {[
              { value: totalPoints.toString(), label: 'Points' },
              { value: season2025.filter(r => r.status === 'completed').length.toString(), label: 'Rounds disputés' },
              { value: season2025.length.toString(), label: 'Rounds total' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center px-6 py-4"
                style={{
                  background: 'rgba(255,90,0,0.05)',
                  border: '1px solid rgba(255,90,0,0.1)',
                }}
              >
                <div
                  className="font-display text-3xl"
                  style={{ color: 'var(--orange)' }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-condensed text-xs tracking-widest uppercase mt-1"
                  style={{ color: 'rgba(245,245,245,0.4)', letterSpacing: '0.15em' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Race cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {season2025.map((round) => (
            <div
              key={round.round}
              className="relative overflow-hidden flex flex-col"
              style={{
                background: 'var(--dark)',
                border: round.status === 'completed'
                  ? '1px solid rgba(255,90,0,0.15)'
                  : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Round number accent */}
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: round.status === 'completed'
                    ? 'linear-gradient(90deg, #FF3300, #FF5A00)'
                    : 'rgba(255,255,255,0.05)',
                }}
              />

              {/* Image or placeholder */}
              <div
                className="relative overflow-hidden"
                style={{ height: '120px', background: 'rgba(255,255,255,0.02)' }}
              >
                {round.image ? (
                  <Image
                    src={round.image}
                    alt={`Round ${round.round}`}
                    fill
                    className="object-cover opacity-70"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'var(--gray)' }}
                  >
                    <span
                      className="font-display text-4xl"
                      style={{ color: 'rgba(255,90,0,0.1)' }}
                    >
                      R{round.round}
                    </span>
                  </div>
                )}
                {round.image && (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 60%)' }}
                  />
                )}

                {/* Flag */}
                <div className="absolute top-3 right-3 text-xl">{round.flag}</div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-condensed text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(245,245,245,0.4)', letterSpacing: '0.2em' }}
                  >
                    ROUND {round.round}
                  </span>
                  <span
                    className="font-condensed text-xs tracking-widest uppercase px-2 py-1"
                    style={{
                      background: round.status === 'completed'
                        ? 'rgba(255,90,0,0.1)'
                        : 'rgba(255,255,255,0.04)',
                      color: round.status === 'completed'
                        ? 'var(--orange)'
                        : 'rgba(245,245,245,0.3)',
                      border: round.status === 'completed'
                        ? '1px solid rgba(255,90,0,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {round.status === 'completed' ? 'Terminé' : 'À venir'}
                  </span>
                </div>

                <h3
                  className="font-condensed font-700 text-sm leading-tight mb-1"
                  style={{ color: 'var(--white)', fontFamily: 'var(--font-condensed)' }}
                >
                  {round.circuit}
                </h3>
                <div
                  className="text-xs mb-4"
                  style={{ color: 'rgba(245,245,245,0.4)' }}
                >
                  {round.country} — {round.date}
                </div>

                {/* Result */}
                <div className="mt-auto">
                  {round.result ? (
                    <div className="flex items-center justify-between">
                      <div
                        className="font-display text-3xl"
                        style={{ color: 'var(--orange)' }}
                      >
                        {round.result}
                      </div>
                      <div className="text-right">
                        <div
                          className="font-display text-xl text-white"
                        >
                          +{round.points} pts
                        </div>
                        <div
                          className="font-condensed text-xs"
                          style={{ color: 'rgba(245,245,245,0.3)' }}
                        >
                          Points marqués
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="font-condensed text-xs tracking-widest uppercase"
                      style={{ color: 'rgba(245,245,245,0.25)' }}
                    >
                      Résultat à venir
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
