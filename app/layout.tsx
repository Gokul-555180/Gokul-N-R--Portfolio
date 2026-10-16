import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'),
  title: {
    default: 'Gokul N. R. — Useful systems, carefully made',
    template: '%s — Gokul N. R.',
  },
  description: 'Gokul N. R. is a Computer Science and Engineering student building useful software, AI-assisted workflows, and thoughtful digital experiences.',
  keywords: ['Gokul N. R.', 'software engineering', 'React', 'Next.js', 'Django', 'AI'],
  openGraph: {
    title: 'Gokul N. R. — Useful systems, carefully made',
    description: 'Selected software, AI, and interface projects by Gokul N. R.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#1454A4',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
