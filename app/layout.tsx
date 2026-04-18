import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800'],
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Atelier — AI Domain Name Generator',
  description:
    'Generate creative, brandable domain names instantly. Move beyond the search box with an intelligent workspace designed for creators.',
  keywords: ['domain generator', 'AI domain names', 'startup names', 'domain availability', 'brandable domains'],
  openGraph: {
    title: 'Atelier — AI Domain Name Generator',
    description: 'Generate creative, brandable domain names instantly with AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier — AI Domain Name Generator',
    description: 'Generate creative, brandable domain names instantly with AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${manrope.variable}`}>
      <body className="font-body antialiased bg-background text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed-variant">
        {children}
      </body>
    </html>
  )
}
