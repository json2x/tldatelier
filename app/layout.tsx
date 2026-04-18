import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atelier.domains'

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Atelier — AI Domain Name Generator',
    template: '%s | Atelier',
  },
  description:
    'Generate creative, brandable domain names instantly. Move beyond the search box with an intelligent workspace designed for creators.',
  keywords: [
    'domain generator',
    'AI domain names',
    'startup names',
    'domain availability',
    'brandable domains',
    'domain name search',
    'AI naming tool',
    'business name generator',
    'domain finder',
    'creative domain names',
  ],
  authors: [{ name: 'Atelier' }],
  creator: 'Atelier',
  publisher: 'Atelier',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Atelier — AI Domain Name Generator',
    description:
      'Generate creative, brandable domain names instantly. Move beyond the search box with an intelligent workspace designed for creators.',
    url: '/',
    siteName: 'Atelier',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier — AI Domain Name Generator',
    description:
      'Generate creative, brandable domain names instantly with AI.',
    creator: '@atelier',
  },
  other: {
    'theme-color': '#5516be',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Atelier',
    'application-name': 'Atelier',
    'msapplication-TileColor': '#5516be',
  },
}

/* ─── JSON-LD Structured Data ─────────────────────────────────────────────── */

function JsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Atelier',
    url: SITE_URL,
    description:
      'Generate creative, brandable domain names instantly. Move beyond the search box with an intelligent workspace designed for creators.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Atelier',
    url: SITE_URL,
    description:
      'AI-powered domain name generator that creates creative, brandable domain names instantly.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${manrope.variable}`}>
      <body className="font-body antialiased bg-background text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed-variant">
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
