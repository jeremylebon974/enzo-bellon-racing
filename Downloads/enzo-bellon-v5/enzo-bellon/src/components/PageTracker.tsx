'use client'
import { useEffect } from 'react'
import { trackPageView, trackScroll } from '@/lib/tracker'

export default function PageTracker() {
  useEffect(() => {
    trackPageView()

    let maxScroll = 0
    const handleScroll = () => {
      const scrolled = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrolled > maxScroll) {
        maxScroll = scrolled
        if (scrolled % 25 === 0) trackScroll(scrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}