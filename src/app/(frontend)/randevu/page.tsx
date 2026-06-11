import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarClock, MessageCircle, Phone } from 'lucide-react'

import { getSiteSettings } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Online Randevu',
  description: 'Online randevu sistemi çok yakında. O zamana kadar telefon veya WhatsApp ile ulaşın.',
}

export default async function RandevuPage() {
  const s = await getSiteSettings()
  const waDigits = s.whatsapp?.replace(/\D/g, '')
  return (
    <Section>
      <Container className="flex max-w-xl flex-col items-center gap-6 py-10 text-center">
        <span className="bg-sage-50 text-sage-700 flex size-16 items-center justify-center rounded-full">
          <CalendarClock className="size-8" />
        </span>
        <h1 className="text-sage-900 text-3xl font-semibold tracking-tight sm:text-4xl">
          Online randevu çok yakında
        </h1>
        <p className="text-muted-foreground">
          Online randevu sistemimiz hazırlanıyor. O zamana kadar randevunuzu telefon veya WhatsApp
          ile kolayca oluşturabilirsiniz.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {s.phone ? (
            <Button asChild variant="accent" size="lg">
              <a href={`tel:${s.phone.replace(/\s/g, '')}`}>
                <Phone />
                {s.phone}
              </a>
            </Button>
          ) : null}
          {waDigits ? (
            <Button asChild variant="outline" size="lg">
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg">
              <Link href="/iletisim">İletişim</Link>
            </Button>
          )}
        </div>
      </Container>
    </Section>
  )
}
