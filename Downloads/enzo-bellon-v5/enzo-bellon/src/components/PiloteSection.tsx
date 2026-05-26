'use client'
import Image from 'next/image'

const stats = [
  { value: '2025', label: 'Saison en cours' },
  { value: 'N°33', label: 'Numéro de course' },
  { value: 'Moto3', label: 'Catégorie' },
  { value: 'FIM', label: 'JuniorGP' },
]

export default function PiloteSection() {
  return (
    <section
      id="pilote"
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--carbon)' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255,90,0,0.03) 40px,
              rgba(255,90,0,0.03) 41px
            )
          `,
        }}
      />

      {/* Orange side accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--orange), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            {/* Frame decoration */}
            <div
              className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2"
              style={{ borderColor: 'var(--orange)' }}
            />
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2"
              style={{ borderColor: 'rgba(255,90,0,0.3)' }}
            />

            <div
              className="relative overflow-hidden"
              style={{
                clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)',
              }}
            >
              <Image
                src="/images/pilot/enzo-1.jpg"
                alt="Enzo Bellon Pilote"
                width={600}
                height={700}
                className="w-full object-cover"
                style={{ aspectRatio: '4/5' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 50%)',
                }}
              />
            </div>

            {/* Floating stat card */}
            <div
              className="absolute bottom-8 -right-6 px-6 py-4"
              style={{
                background: 'rgba(10,10,10,0.9)',
                border: '1px solid rgba(255,90,0,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                className="font-display text-4xl"
                style={{ color: 'var(--orange)' }}
              >
                #33
              </div>
              <div
                className="font-condensed text-xs tracking-widest uppercase"
                style={{ color: 'rgba(245,245,245,0.5)' }}
              >
                JuniorGP Moto3
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="section-tag mb-4 block">Le Pilote</span>

            <h2
              className="font-display mb-6"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.9, letterSpacing: '-0.01em' }}
            >
              <span className="block text-white">UNE IDENTITÉ</span>
              <span className="block" style={{ color: 'var(--orange)' }}>
                RACING
              </span>
            </h2>

            <div className="line-accent mb-8" />

            <div className="space-y-4 mb-10">
              <p className="text-base leading-relaxed" style={{ color: 'rgba(245,245,245,0.7)' }}>
                Né à La Réunion, formé sur les circuits européens, Enzo Bellon s'est imposé 
                comme l'un des talents français les plus suivis de sa génération.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(245,245,245,0.7)' }}>
                Engagé en <strong style={{ color: 'var(--white)' }}>FIM JuniorGP Moto3 World Championship</strong>, 
                il dispute la saison 2025 sous les couleurs Fasty Foxy, numéro 33.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(245,245,245,0.7)' }}>
                Vitesse, discipline, ambition. Chaque course est une étape vers le sommet.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="py-4 px-3 text-center"
                  style={{
                    background: 'rgba(255,90,0,0.05)',
                    border: '1px solid rgba(255,90,0,0.1)',
                  }}
                >
                  <div
                    className="font-display text-xl mb-1"
                    style={{ color: 'var(--orange)' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-condensed text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(245,245,245,0.4)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <a href="#galerie" className="btn-outline text-sm">
                Voir la galerie
              </a>
              <a href="#saison" className="btn-primary text-sm">
                Saison 2025
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
