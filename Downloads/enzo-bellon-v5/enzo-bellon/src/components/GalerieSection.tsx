'use client'
import Image from 'next/image'

const galleryItems = [
  { src: '/images/pilot/enzo-11.jpg', title: 'En Piste', category: 'RACING', span: 'lg:col-span-2 lg:row-span-2' },
  { src: '/images/helmets/helmet-1.jpg', title: 'Casque N°33', category: 'EQUIPMENT', span: '' },
  { src: '/images/pilot/enzo-12.jpg', title: 'Paddock', category: 'BACKSTAGE', span: '' },
  { src: '/images/track/barcelona-round1.jpg', title: 'Round 1 — Barcelona', category: 'RACE', span: 'lg:col-span-2' },
  { src: '/images/helmets/helmet-2.jpg', title: 'Fasty Foxy Helmet', category: 'EQUIPMENT', span: '' },
  { src: '/images/pilot/enzo-15.jpg', title: 'Focus', category: 'RACING', span: '' },
  { src: '/images/pilot/enzo-16.jpg', title: 'Vitesse', category: 'ACTION', span: '' },
  { src: '/images/helmets/helmet-3.jpg', title: 'Détail casque', category: 'EQUIPMENT', span: '' },
  { src: '/images/pilot/enzo-17.jpg', title: 'Ligne droite', category: 'RACING', span: '' },
]

export default function GalerieSection() {
  return (
    <section
      id="galerie"
      className="relative py-32 overflow-hidden"
      style={{ background: 'var(--black)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-tag mb-3 block">Photos Officielles</span>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: 0.9 }}
            >
              <span className="text-white">GALERIE</span>
              <br />
              <span style={{ color: 'var(--orange)' }}>2025</span>
            </h2>
          </div>
          <div className="line-accent mb-4 sm:mb-0" />
        </div>

        {/* Gallery grid - masonry-style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`gallery-item relative overflow-hidden cursor-pointer ${item.span}`}
              style={{
                aspectRatio: item.span.includes('row-span-2') ? '1/1.8' : item.span.includes('col-span-2') ? '16/7' : '4/3',
                minHeight: '200px',
              }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover"
              />

              {/* Dark base overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'rgba(10,10,10,0.3)' }}
              />

              {/* Hover overlay */}
              <div
                className="gallery-overlay absolute inset-0 flex flex-col justify-end p-5"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)',
                }}
              >
                <div
                  className="font-condensed text-xs tracking-widest uppercase mb-1"
                  style={{ color: 'var(--orange)', letterSpacing: '0.25em' }}
                >
                  {item.category}
                </div>
                <div
                  className="font-display text-lg text-white"
                  style={{ lineHeight: 1 }}
                >
                  {item.title}
                </div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  border: '1px solid rgba(255,90,0,0.5)',
                  borderLeft: 'none',
                  borderBottom: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="btn-outline inline-flex"
          >
            Voir toutes les photos
          </a>
        </div>
      </div>
    </section>
  )
}
