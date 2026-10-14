import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'),
  title: {
    default: 'Gokul N. R. — Interactive Developer Portfolio',
    template: '%s — Gokul N. R.',
  },
  description: 'Gokul N. R. builds thoughtful digital experiences at the intersection of software, AI, and design.',
  keywords: ['Gokul N. R.', 'developer portfolio', 'React', 'Next.js', 'UI/UX', 'AI'],
  openGraph: {
    title: 'Gokul N. R. — Interactive Developer Portfolio',
    description: 'Enter a playable developer portfolio: projects, tools, and the thinking behind them.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#171a2b',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
