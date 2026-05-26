'use client'
import Image from 'next/image'

export default function CollectionSection() {
  return (
    <section
      id="collection"
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--black)' }}
    >
      {/* Big background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-display whitespace-nowrap"
          style={{
            fontSize: 'clamp(100px, 18vw, 260px)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,90,0,0.04)',
            letterSpacing: '-0.02em',
          }}
        >
          FASTY FOXY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="section-tag mb-4 block">Collection Officielle</span>
          <h2
            className="font-display mb-6"
            style={{ fontSize: 'clamp(48px, 7vw, 90px)', lineHeight: 0.9 }}
          >
            <span className="text-white">FASTY</span>{' '}
            <span style={{ color: 'var(--orange)' }}>FOXY</span>
          </h2>
          <div className="line-accent mx-auto mb-6" />
          <p
            className="max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: 'rgba(245,245,245,0.6)' }}
          >
            Une collection pensée pour les supporters, les passionnés de vitesse 
            et ceux qui veulent porter l'univers d'Enzo Bellon.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Large left panel */}
          <div
            className="lg:col-span-2 relative overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            <Image
              src="/images/pilot/enzo-14.jpg"
              alt="Fasty Foxy Collection"
              fill
              className="object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, transparent 40%, rgba(10,10,10,0.9) 100%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)',
              }}
            />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 p-10">
              <div
                className="inline-block font-display text-6xl mb-2"
                style={{ color: 'var(--orange)', lineHeight: 1 }}
              >
                N°33
              </div>
              <div
                className="font-condensed text-sm tracking-widest uppercase"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                Fasty Foxy — Saison 2025
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col">
            {/* Top panel */}
            <div
              className="relative overflow-hidden flex-1"
              style={{ minHeight: '250px', background: 'var(--gray)' }}
            >
              <Image
                src="/images/helmets/helmet-1.jpg"
                alt="Casque Fasty Foxy"
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)' }}
              />
              <div className="absolute bottom-0 left-0 p-6">
                <div
                  className="font-condensed font-700 text-sm tracking-widest uppercase"
                  style={{ color: 'var(--orange)' }}
                >
                  Casque Officiel
                </div>
                <div
                  className="font-display text-2xl text-white"
                >
                  FASTY FOXY
                </div>
              </div>
            </div>

            {/* Bottom feature card */}
            <div
              className="p-8 flex-1"
              style={{
                background: 'linear-gradient(135deg, #FF3300 0%, #FF5A00 100%)',
              }}
            >
              <div
                className="font-condensed text-xs tracking-widest uppercase mb-4"
                style={{ color: 'rgba(0,0,0,0.5)', letterSpacing: '0.25em' }}
              >
                Racing Streetwear
              </div>
              <h3
                className="font-display text-3xl text-black mb-4"
                style={{ lineHeight: 1 }}
              >
                SPEED IS
                <br />A LIFESTYLE
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'rgba(0,0,0,0.65)' }}
              >
                Chaque pièce incarne l'esprit racing. 
                Qualité premium. Edition limitée.
              </p>
              <a
                href="#boutique"
                className="inline-flex items-center gap-2 font-condensed text-sm tracking-widest uppercase font-700"
                style={{ color: 'rgba(0,0,0,0.8)', letterSpacing: '0.15em' }}
              >
                Voir la boutique
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Brand pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-px" style={{ background: 'rgba(255,90,0,0.1)' }}>
          {[
            { title: 'VITESSE', desc: 'Conçu pour ceux qui ne s\'arrêtent pas.', icon: '⚡' },
            { title: 'IDENTITÉ', desc: 'Porter le N°33, c\'est rejoindre l\'aventure.', icon: '🦊' },
            { title: 'EXCELLENCE', desc: 'Qualité premium, finitions racing factory.', icon: '🏆' },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 text-center"
              style={{ background: 'var(--carbon)' }}
            >
              <div className="text-3xl mb-3">{pillar.icon}</div>
              <div
                className="font-display text-xl mb-2"
                style={{ color: 'var(--orange)' }}
              >
                {pillar.title}
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
