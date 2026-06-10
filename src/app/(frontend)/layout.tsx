import React from 'react'
import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'

import './globals.css'

// Display: karakterli, sicak yuz. Body: temiz humanist sans.
// latin-ext, Turkce gliflerini (I, i, s, g, c, o, u) kapsar.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'Uzm. Dyt. Özden Özgür Durukan',
    template: '%s | Uzm. Dyt. Özden Özgür Durukan',
  },
  description:
    'Ankara/Çankaya — kişiye özel, bilim temelli beslenme ve diyet danışmanlığı. 18 yıl deneyim. Online ve yüz yüze randevu.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="tr" className={`${fraunces.variable} ${hankenGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
