import Link from 'next/link'
import { AtSign, Clock, Leaf, MapPin, Phone } from 'lucide-react'

import { getSiteSettings } from '@/lib/payload'
import { navLinks } from '@/lib/nav'
import { Container } from './Container'

export async function Footer() {
  const s = await getSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-sage-900 text-sage-50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-sage-700 flex size-9 items-center justify-center rounded-full">
              <Leaf className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">Özden Özgür Durukan</span>
          </div>
          <p className="text-sage-200 text-sm leading-relaxed">
            Ankara/Çankaya’da kişiye özel, bilim temelli beslenme ve diyet danışmanlığı.
            Yanınızdaki uzman.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <h3 className="mb-1 text-sm font-semibold tracking-wide uppercase">Sayfalar</h3>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sage-200 hover:text-sage-50 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="mb-1 text-sm font-semibold tracking-wide uppercase">İletişim</h3>
          {s.phone ? (
            <a
              href={`tel:${s.phone.replace(/\s/g, '')}`}
              className="text-sage-200 hover:text-sage-50 flex items-start gap-2 text-sm"
            >
              <Phone className="mt-0.5 size-4 shrink-0" />
              {s.phone}
            </a>
          ) : null}
          {s.address ? (
            <p className="text-sage-200 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {s.address}
            </p>
          ) : null}
          {s.workingHours ? (
            <p className="text-sage-200 flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0" />
              {s.workingHours}
            </p>
          ) : null}
          {s.instagram ? (
            <a
              href={s.instagramUrl || `https://instagram.com/${s.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-200 hover:text-sage-50 flex items-start gap-2 text-sm"
            >
              <AtSign className="mt-0.5 size-4 shrink-0" />
              {s.instagram}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-sm font-semibold tracking-wide uppercase">Yasal</h3>
          <Link href="/kvkk" className="text-sage-200 hover:text-sage-50 text-sm transition-colors">
            KVKK Aydınlatma Metni
          </Link>
          <Link
            href="/gizlilik"
            className="text-sage-200 hover:text-sage-50 text-sm transition-colors"
          >
            Gizlilik & Çerez Politikası
          </Link>
        </div>
      </Container>

      <div className="border-sage-700/50 border-t">
        <Container className="text-sage-200 flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {year} Uzm. Dyt. Özden Özgür Durukan. Tüm hakları saklıdır.</p>
          <p>Ankara · Çankaya</p>
        </Container>
      </div>
    </footer>
  )
}
