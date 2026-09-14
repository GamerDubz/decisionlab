import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DecisionLab — Weighted Multi-Criteria Decision Matrix',
  description:
    'Make rational, high-confidence choices with weighted scoring matrices, criteria calibration, and structured decision scorecards.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-violet-500/20 selection:text-violet-900`}>
        {children}
      </body>
    </html>
  )
}
