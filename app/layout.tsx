import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'DecisionLab — Structured Decision Making Tool',
  description: 'Make better decisions with weighted scoring matrices, visualization, and structured comparison.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
