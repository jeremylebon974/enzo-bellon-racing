'use client'
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,90,0,0.1)' }}
    >
      {/* Big background number */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '300px',
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,90,0,0.04)',
        }}
      >
        33
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FF3300, #FF5A00)',
                  clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)',
                }}
              >
                <span
                  className="font-display text-white"
                  style={{ fontSize: '16px' }}
                >
                  33
                </span>
              </div>
              <div>
                <div
                  className="font-display text-xl text-white leading-none tracking-wider"
                >
                  ENZO BELLON
                </div>
                <div
                  className="font-condensed text-xs tracking-widest uppercase"
                  style={{ color: 'var(--orange)', letterSpacing: '0.2em' }}
                >
                  Fasty Foxy Racing
                </div>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6"
              style={{ color: 'rgba(245,245,245,0.4)' }}
            >
              Pilote officiel FIM JuniorGP Moto3 World Championship. 
              N°33 — France / La Réunion.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'TikTok', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-condensed text-xs tracking-wider uppercase px-4 py-2"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(245,245,245,0.4)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--orange)'
                    e.currentTarget.style.borderColor = 'rgba(255,90,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(245,245,245,0.4)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div
              className="font-condensed text-xs tracking-widest uppercase mb-6"
              style={{ color: 'var(--orange)', letterSpacing: '0.2em' }}
            >
              Navigation
            </div>
            <ul className="space-y-3">
              {[
                { href: '#pilote', label: 'Le Pilote' },
                { href: '#collection', label: 'Collection' },
                { href: '#boutique', label: 'Boutique' },
                { href: '#galerie', label: 'Galerie' },
                { href: '#saison', label: 'Saison 2025' },
                { href: '#partenaires', label: 'Partenaires' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(245,245,245,0.45)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div
              className="font-condensed text-xs tracking-widest uppercase mb-6"
              style={{ color: 'var(--orange)', letterSpacing: '0.2em' }}
            >
              Contact
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@enzobellon.fr"
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'rgba(245,245,245,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}
                >
                  contact@enzobellon.fr
                </a>
              </li>
              <li>
                <a
                  href="mailto:partenaires@enzobellon.fr"
                  className="text-sm transition-colors duration-200"
                  style={{ color: 'rgba(245,245,245,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}
                >
                  Devenir partenaire
                </a>
              </li>
              <li>
                <span
                  className="text-sm"
                  style={{ color: 'rgba(245,245,245,0.3)' }}
                >
                  FIM JuniorGP Moto3
                </span>
              </li>
              <li>
                <span
                  className="text-sm"
                  style={{ color: 'rgba(245,245,245,0.3)' }}
                >
                  France / La Réunion
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="font-condensed text-xs tracking-wider"
            style={{ color: 'rgba(245,245,245,0.25)' }}
          >
            © {year} Enzo Bellon. Tous droits réservés. Fasty Foxy Racing.
          </div>
          <div className="flex gap-6">
            {['Mentions légales', 'Politique de confidentialité', 'CGV'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-condensed text-xs tracking-wider transition-colors"
                style={{ color: 'rgba(245,245,245,0.25)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.6)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.25)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
