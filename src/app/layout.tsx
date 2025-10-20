import type { Metadata } from 'next'
import { Inter, Poppins, Montserrat, Kanit, Varela_Round } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat'
})
const kanit = Kanit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit'
})
const varelaRound = Varela_Round({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-varela-round'
})

export const metadata: Metadata = {
  title: 'Highway Burger - En Lezzetli Burgerler',
  description: 'En lezzetli burgerleri kapınıza getiriyoruz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${poppins.variable} ${montserrat.variable} ${kanit.variable} ${varelaRound.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <BottomNavigation />
          </div>
        </Providers>
      </body>
    </html>
  )
}

