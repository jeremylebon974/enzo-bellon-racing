'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [checked, setChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const already = localStorage.getItem('eb_newsletter_done')
    if (already) return
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setClosing(true)
    localStorage.setItem('eb_newsletter_done', '1')
    setTimeout(() => setVisible(false), 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prenom.trim()) { setError("Merci d'entrer ton prénom."); return }
    if (!email.includes('@')) { setError('Adresse email invalide.'); return }
    if (!checked) { setError("Merci de cocher la case pour continuer."); return }
    setError('')
    await supabase.from('clients').insert([{ prenom, email }])
    setSubmitted(true)
    localStorage.setItem('eb_newsletter_done', '1')
    setTimeout(() => handleClose(), 2800)
  }

  if (!visible) return null

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', opacity: closing ? 0 : 1, transition: 'opacity 0.3s ease' }} />
      <div className="fixed z-50" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${closing ? 0.94 : 1})`, opacity: closing ? 0 : 1, transition: 'all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)', width: '100%', maxWidth: '520px', padding: '0 16px' }}>
        <div className="relative overflow-hidden" style={{ background: 'var(--carbon)', border: '1px solid rgba(255,90,0,0.25)', boxShadow: '0 0 80px rgba(255,90,0,0.12), 0 40px 100px rgba(0,0,0,0.7)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: 'linear-gradient(90deg,#FF3300,#FF5A00)' }} />
          <div className="absolute inset-0">
            <Image src="/images/pilot/enzo-11.jpg" alt="" fill className="object-cover object-top" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(20,20,20,0.98) 50%, rgba(20,20,20,0.7) 100%)' }} />
          </div>
          <div className="absolute right-0 bottom-0 pointer-events-none select-none" style={{ fontFamily: 'var(--font-display)', fontSize: '220px', lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '1px rgba(255,90,0,0.05)' }}>33</div>

          <button type="button" onClick={(e) => { e.stopPropagation(); handleClose() }}
            className="absolute top-4 right-4 z-20 flex items-center justify-center transition-all duration-200"
            style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,245,0.6)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,90,0,0.15)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(245,245,245,0.6)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="relative z-10 p-8 sm:p-10">
            {!submitted ? (
              <>
                <div className="mb-7">
                  <div className="font-bold text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--orange)', letterSpacing: '0.25em' }}>Fasty Foxy — N°33</div>
                  <h2 className="font-display leading-none mb-3" style={{ fontSize: 'clamp(34px,5vw,50px)' }}>
                    <span className="text-white">REJOINS</span><br />
                    <span style={{ color: 'var(--orange)' }}>LA COMMUNAUTÉ</span>
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,245,245,0.5)' }}>Sois le premier informé des nouvelles collections, résultats et offres exclusives.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" placeholder="Ton prénom" value={prenom} onChange={e => setPrenom(e.target.value)}
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', fontFamily: 'var(--font-body)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,90,0,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  <input type="email" placeholder="Ton adresse email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', fontFamily: 'var(--font-body)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(255,90,0,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  <div className="flex items-start gap-3 cursor-pointer p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => setChecked(!checked)}>
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
                      style={{ background: checked ? 'linear-gradient(135deg,#FF3300,#FF5A00)' : 'transparent', border: checked ? 'none' : '1px solid rgba(255,255,255,0.25)', minWidth: '20px' }}>
                      {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                    </div>
                    <span className="text-xs leading-relaxed select-none" style={{ color: 'rgba(245,245,245,0.6)' }}>
                      Je souhaite être tenu informé des <strong style={{ color: 'var(--white)' }}>nouvelles collections</strong>, résultats de course et actualités Fasty Foxy N°33.
                    </span>
                  </div>
                  {error && <p className="text-xs px-1" style={{ color: 'var(--orange)' }}>{error}</p>}
                  <button type="submit" className="w-full py-4 font-bold text-sm tracking-widest uppercase transition-all duration-200"
                    style={{ fontFamily: 'var(--font-condensed)', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: '#fff', letterSpacing: '0.2em', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(255,90,0,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
                    Je rejoins la communauté
                  </button>
                  <p className="text-xs text-center pt-1" style={{ color: 'rgba(245,245,245,0.2)' }}>Pas de spam. Désinscription possible à tout moment.</p>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#FF3300,#FF5A00)', clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 className="font-display text-4xl mb-3" style={{ color: 'var(--orange)' }}>BIENVENUE<br />{prenom.toUpperCase()} !</h3>
                <p className="text-sm" style={{ color: 'rgba(245,245,245,0.55)' }}>Tu fais maintenant partie de la communauté<br /><strong style={{ color: 'var(--white)' }}>Fasty Foxy N°33.</strong></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
