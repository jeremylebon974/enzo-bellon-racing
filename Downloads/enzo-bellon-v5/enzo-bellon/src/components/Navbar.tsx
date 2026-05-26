'use client'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#boutique', label: 'Boutique' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#saison', label: 'Saison' },
  { href: '#partenaires', label: 'Partenaires' },
]

const IgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fcb045"/>
        <stop offset="50%" stopColor="#fd1d1d"/>
        <stop offset="100%" stopColor="#833ab4"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="#fcb045"/>
  </svg>
)

const FbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [social, setSocial] = useState({ instagram: 0, facebook: 0 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    const saved = localStorage.getItem('eb_social_stats')
    if (saved) setSocial(JSON.parse(saved))
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n > 0 ? n.toString() : '—'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,90,0,0.1)' : 'none',
      }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF3300, #FF5A00)', clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)' }}>
            <span className="font-display text-white text-sm">33</span>
          </div>
          <div>
            <div className="font-display text-white text-lg leading-none tracking-wider">ENZO BELLON</div>
            <div className="font-condensed text-xs tracking-widest uppercase leading-none" style={{ color: 'var(--orange)', letterSpacing: '0.2em' }}>Fasty Foxy</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className="font-condensed text-sm tracking-widest uppercase transition-colors duration-200"
              style={{ color: 'rgba(245,245,245,0.65)', letterSpacing: '0.15em' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,245,245,0.65)'}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — social + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://www.instagram.com/33fastyfoxy/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(253,29,29,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
            <IgIcon />
            <span className="font-condensed text-xs font-bold" style={{ color: 'rgba(245,245,245,0.8)' }}>
              {formatNumber(social.instagram)}
            </span>
          </a>
          <a href="https://www.facebook.com/33fastyfoxy" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(24,119,242,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
            <FbIcon />
            <span className="font-condensed text-xs font-bold" style={{ color: 'rgba(245,245,245,0.8)' }}>
              {formatNumber(social.facebook)}
            </span>
          </a>
          <a href="#boutique" className="btn-primary text-xs py-2 px-5">Boutique</a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className="block w-6 h-0.5 transition-all duration-200"
            style={{ background: 'var(--white)', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span className="block w-6 h-0.5 transition-all duration-200"
            style={{ background: 'var(--white)', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 transition-all duration-200"
            style={{ background: 'var(--white)', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(255,90,0,0.1)' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="font-condensed text-base tracking-widest uppercase"
              style={{ color: 'rgba(245,245,245,0.8)', letterSpacing: '0.15em' }}>
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-2">
            <a href="https://www.instagram.com/33fastyfoxy/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <IgIcon />
              <span className="font-condensed text-xs font-bold" style={{ color: 'rgba(245,245,245,0.8)' }}>{formatNumber(social.instagram)}</span>
            </a>
            <a href="https://www.facebook.com/33fastyfoxy" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <FbIcon />
              <span className="font-condensed text-xs font-bold" style={{ color: 'rgba(245,245,245,0.8)' }}>{formatNumber(social.facebook)}</span>
            </a>
          </div>
          <a href="#boutique" onClick={() => setMenuOpen(false)} className="btn-primary text-xs py-2 px-5 self-start mt-2">Boutique</a>
        </div>
      )}
    </nav>
  )
}