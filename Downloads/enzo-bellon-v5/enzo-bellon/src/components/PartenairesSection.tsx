'use client'
import Image from 'next/image'

const partenaires = [
  {
    name: 'Shark Helmets',
    logo: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780043491/Logo_Shark_ty2xrn.png',
    url: 'https://www.shark-helmets.com',
    description: 'Casques moto premium',
    invert: false,
  },
  {
    name: 'Furygan',
    logo: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780043491/logo_furygan_podftv.png',
    url: 'https://www.furygan.com',
    description: 'Équipements moto',
    invert: true,
  },
  {
    name: 'On Air Fitness',
    logo: 'https://res.cloudinary.com/drcipztzo/image/upload/v1780043491/Logo_On_Air_yjot63.png',
    url: 'https://onair-fitness.fr',
    description: 'Original Fitness',
    invert: false,
  },
]

export default function PartenairesSection() {
  return (
    <section id="partenaires" style={{ background: 'var(--dark)', borderTop: '1px solid rgba(255,90,0,0.08)' }}>
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="font-bold text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.25em' }}>
              Ils me font confiance
            </div>
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(36px,5vw,64px)' }}>
              <span className="text-white">MES </span>
              <span style={{ color: 'var(--orange)' }}>PARTENAIRES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partenaires.map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-10 transition-all duration-300"
                style={{
                  background: 'var(--carbon)',
                  border: '1px solid rgba(255,90,0,0.08)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,90,0,0.4)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,90,0,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                <div className="relative mb-6" style={{ width: '160px', height: '100px' }}>
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    className="object-contain"
                    style={{ filter: p.invert ? 'invert(1)' : 'none' }}
                  />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm mb-1"
                    style={{ fontFamily: 'var(--font-condensed)', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {p.name}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(245,245,245,0.4)' }}>{p.description}</div>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.15em' }}>
                  Visiter →
                </div>
              </a>
            ))}
          </div>

          {/* Devenir partenaire */}
          <div className="mt-16 p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ border: '1px solid rgba(255,90,0,0.1)', background: 'rgba(255,90,0,0.03)' }}>
            <div>
              <div className="font-display text-xl text-white mb-1">DEVENIR PARTENAIRE</div>
              <p className="text-sm" style={{ color: 'rgba(245,245,245,0.4)' }}>
                Associez votre marque à un talent racing en pleine ascension
              </p>
            </div>
            <a href="mailto:contact@enzobellon.fr" className="btn-primary">
              Contacter l'équipe
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}