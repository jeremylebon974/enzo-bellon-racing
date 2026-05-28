export const dynamic = 'force-dynamic'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import BoutiqueSection from '@/components/BoutiqueSection'
import GalerieSection from '@/components/GalerieSection'
import SaisonSection from '@/components/SaisonSection'
import PartenairesSection from '@/components/PartenairesSection'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import PageTracker from '@/components/PageTracker'

export default function Home() {
  return (
    <main>
      <Navbar />
      <PageTracker />
      <Hero />
      <BoutiqueSection />
      <GalerieSection />
      <SaisonSection />
      <PartenairesSection />
      <Footer />
      <NewsletterPopup />
    </main>
  )
}