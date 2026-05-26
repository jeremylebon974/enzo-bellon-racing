'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end overflow-hidden"
      style={{ background: 'var(--black)' }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/pilot/enzo-13.jpg"
          alt="Enzo Bellon N°33"
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.5 }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(10,10,10,0.95) 35%, rgba(10,10,10,0.4) 70%, rgba(10,10,10,0.2) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 30%, transparent 60%)',
          }}
        />
        {/* Orange glow */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96"
          style={{
            background: 'radial-gradient(circle, rgba(255,90,0,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Big number background */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 number-badge select-none"
        style={{
          fontSize: 'clamp(160px, 22vw, 320px)',
          fontFamily: 'var(--font-display)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,90,0,0.07)',
          lineHeight: 0.85,
        }}
      >
        33
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full"
        style={{
          transition: 'all 0.8s ease',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'none' : 'translateY(20px)',
        }}
      >
        <div className="max-w-2xl">
          {/* Tag line */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px w-12"
              style={{ background: 'var(--orange)' }}
            />
            <span
              className="font-condensed text-xs tracking-widest uppercase"
              style={{ color: 'var(--orange)', letterSpacing: '0.25em' }}
            >
              FIM JuniorGP Moto3 World Championship
            </span>
          </div>

          {/* Main title */}
          <h1
            className="font-display leading-none mb-4"
            style={{
              fontSize: 'clamp(64px, 10vw, 130px)',
              letterSpacing: '-0.01em',
              lineHeight: 0.9,
            }}
          >
            <span className="block text-white">ENZO</span>
            <span
              className="block"
              style={{
                color: 'var(--orange)',
                textShadow: '0 0 60px rgba(255,90,0,0.3)',
              }}
            >
              BELLON
            </span>
          </h1>

          {/* Subtitle row */}
          <div className="flex items-center gap-4 mb-8">
            <span
              className="font-condensed font-700 text-2xl"
              style={{ color: 'rgba(245,245,245,0.5)', fontFamily: 'var(--font-condensed)' }}
            >
              N°33
            </span>
            <div className="w-px h-5" style={{ background: 'rgba(255,90,0,0.4)' }} />
            <span
              className="font-condensed font-600 text-2xl tracking-wide"
              style={{ color: 'rgba(245,245,245,0.5)', fontFamily: 'var(--font-condensed)' }}
            >
              FASTY FOXY
            </span>
            <div className="w-px h-5" style={{ background: 'rgba(255,90,0,0.4)' }} />
            <span
              className="font-condensed text-sm tracking-widest uppercase"
              style={{ color: 'rgba(245,245,245,0.4)', fontFamily: 'var(--font-condensed)' }}
            >
              France / La Réunion
            </span>
          </div>

          {/* Description */}
          <p
            className="text-base mb-10 max-w-md leading-relaxed"
            style={{ color: 'rgba(245,245,245,0.55)', fontFamily: 'var(--font-body)' }}
          >
            Pilote professionnel. Talent français engagé sur la scène mondiale du Moto3. 
            Vitesse. Discipline. Ambition.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a href="#boutique" className="btn-primary">
              Découvrir la collection
            </a>
            <a href="#saison" className="btn-outline">
              Suivre la saison
            </a>
          </div>
        </div>
      </div>

      {/* Scrolling strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden flex items-center"
        style={{ background: 'var(--orange)' }}
      >
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-sm tracking-widest whitespace-nowrap px-8"
              style={{ color: 'rgba(0,0,0,0.5)', letterSpacing: '0.3em' }}
            >
              ENZO BELLON — N°33 — FASTY FOXY — FIM JUNIORGP MOTO3 — WORLD CHAMPIONSHIP
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
