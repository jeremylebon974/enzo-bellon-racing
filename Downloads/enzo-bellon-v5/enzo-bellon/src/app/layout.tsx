import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import MiniCart from '@/components/MiniCart'

export const metadata: Metadata = {
  title: 'Enzo Bellon — FIM JuniorGP Moto3 World Championship | N°33 Fasty Foxy',
  description: 'Site officiel d\'Enzo Bellon, pilote professionnel engagé en FIM JuniorGP Moto3 World Championship.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
          <MiniCart />
        </CartProvider>
      </body>
    </html>
  )
}