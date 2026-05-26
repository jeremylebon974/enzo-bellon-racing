'use client'
import Image from 'next/image'

export default function PartenairesSection() {
  return (
    <section
      id="partenaires"
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--dark)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/pilot/enzo-18.jpg"
          alt="Enzo Bellon Racing"
          fill
          className="object-cover object-center opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10,10,10,0.97) 40%, rgba(10,10,10,0.85) 100%)',
          }}
        />
      </div>

      {/* Orange glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,90,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Supporter */}
          <div>
            <span className="section-tag mb-4 block">Supporters</span>
            <h2
              className="font-display mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 70px)', lineHeight: 0.9 }}
            >
              <span className="text-white">REJOINS</span>
              <br />
              <span style={{ color: 'var(--orange)' }}>L'AVENTURE</span>
            </h2>
            <div className="line-accent mb-6" />
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: 'rgba(245,245,245,0.6)' }}
            >
              Chaque course, chaque kilomètre, chaque point. Suis Enzo tout au long 
              de sa saison FIM JuniorGP. Porte ses couleurs. Rejoins la communauté 
              Fasty Foxy N°33.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: '🛒', text: 'Collection officielle disponible en boutique' },
                { icon: '📸', text: 'Contenu exclusif paddock sur les réseaux' },
                { icon: '🏁', text: 'Résultats en temps réel chaque weekend de course' },
                { icon: '🤝', text: 'Rencontres paddock lors des rounds' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(245,245,245,0.6)' }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#boutique" className="btn-primary">
                Boutique Officielle
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Partners */}
          <div>
            <span className="section-tag mb-4 block">Partenaires</span>
            <h2
              className="font-display mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 70px)', lineHeight: 0.9 }}
            >
              <span className="text-white">DEVENIR</span>
              <br />
              <span style={{ color: 'var(--orange)' }}>PARTENAIRE</span>
            </h2>
            <div className="line-accent mb-6" />
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: 'rgba(245,245,245,0.6)' }}
            >
              Associez votre marque à un talent racing en pleine ascension. 
              Visibilité internationale, contenu premium et présence dans le 
              paddock FIM JuniorGP.
            </p>

            {/* Partnership tiers */}
            <div className="space-y-3 mb-8">
              {[
                { tier: 'TITLE SPONSOR', desc: 'Logo moto + combinaison + tous supports', color: 'var(--orange)' },
                { tier: 'MAJOR SPONSOR', desc: 'Casque + site + réseaux sociaux', color: 'rgba(245,245,245,0.8)' },
                { tier: 'OFFICIAL PARTNER', desc: 'Mentions officielles + merchandising', color: 'rgba(245,245,245,0.5)' },
              ].map((tier) => (
                <div
                  key={tier.tier}
                  className="flex items-center gap-4 p-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="w-1 h-8 flex-shrink-0"
                    style={{ background: tier.color }}
                  />
                  <div>
                    <div
                      className="font-condensed font-700 text-sm tracking-wider"
                      style={{ color: tier.color, fontFamily: 'var(--font-condensed)' }}
                    >
                      {tier.tier}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'rgba(245,245,245,0.4)' }}
                    >
                      {tier.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="mailto:contact@enzobellon.fr"
              className="btn-primary"
            >
              Contacter l'équipe
            </a>
          </div>
        </div>

        {/* Social follow strip */}
        <div
          className="mt-20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            border: '1px solid rgba(255,90,0,0.1)',
            background: 'rgba(255,90,0,0.03)',
          }}
        >
          <div>
            <div
              className="font-display text-xl text-white mb-1"
            >
              SUIVRE ENZO EN TEMPS RÉEL
            </div>
            <p
              className="text-sm"
              style={{ color: 'rgba(245,245,245,0.4)' }}
            >
              Résultats, coulisses, contenu exclusif
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Instagram', href: 'https://instagram.com' },
              { label: 'TikTok', href: 'https://tiktok.com' },
              { label: 'YouTube', href: 'https://youtube.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-condensed text-xs tracking-widest uppercase px-5 py-2.5"
                style={{
                  border: '1px solid rgba(255,90,0,0.2)',
                  color: 'rgba(245,245,245,0.7)',
                  letterSpacing: '0.15em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--orange)'
                  e.currentTarget.style.borderColor = 'rgba(255,90,0,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(245,245,245,0.7)'
                  e.currentTarget.style.borderColor = 'rgba(255,90,0,0.2)'
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
