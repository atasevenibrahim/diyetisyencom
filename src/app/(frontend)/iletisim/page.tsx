import type { Metadata } from 'next'
import { AtSign, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { getSiteSettings } from '@/lib/payload'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { ContactForm } from '@/components/site/ContactForm'
import { JsonLd } from '@/components/site/JsonLd'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'Uzm. Dyt. Özden Özgür Durukan ile iletişime geçin. Ankara/Çankaya — telefon, WhatsApp ve iletişim formu.',
}

export default async function IletisimPage() {
  const s = await getSiteSettings()
  const waDigits = s.whatsapp?.replace(/\D/g, '')

  const items = [
    s.phone && {
      icon: Phone,
      label: 'Telefon',
      value: s.phone,
      href: `tel:${s.phone.replace(/\s/g, '')}`,
    },
    waDigits && {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: s.whatsapp,
      href: `https://wa.me/${waDigits}`,
    },
    s.email && { icon: Mail, label: 'E-posta', value: s.email, href: `mailto:${s.email}` },
    s.instagram && {
      icon: AtSign,
      label: 'Instagram',
      value: s.instagram,
      href: s.instagramUrl || `https://instagram.com/${s.instagram.replace('@', '')}`,
    },
    s.address && { icon: MapPin, label: 'Adres', value: s.address },
    s.workingHours && { icon: Clock, label: 'Çalışma Saatleri', value: s.workingHours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[]

  const businessLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: s.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address || undefined,
      addressLocality: 'Çankaya',
      addressRegion: 'Ankara',
      addressCountry: 'TR',
    },
    openingHours: 'Mo-Su 09:00-19:00',
  }

  return (
    <>
      <JsonLd data={businessLd} />
      <PageHeader
        eyebrow="İletişim"
        title="Bize ulaşın"
        description="Sorularınız için yazın ya da doğrudan arayın; size en kısa sürede dönüş yapalım."
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => {
                const content = (
                  <div className="border-sage-200 flex h-full flex-col gap-2 rounded-2xl border bg-card p-5">
                    <span className="bg-sage-50 text-sage-700 flex size-10 items-center justify-center rounded-lg">
                      <item.icon className="size-5" />
                    </span>
                    <span className="text-muted-foreground text-xs">{item.label}</span>
                    <span className="text-sage-900 text-sm font-medium">{item.value}</span>
                  </div>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="transition-transform hover:-translate-y-0.5"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}
            </div>

            {s.mapEmbedUrl ? (
              <iframe
                src={s.mapEmbedUrl}
                title="Harita"
                loading="lazy"
                className="border-sage-200 h-64 w-full rounded-2xl border"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="border-sage-200 bg-sage-50 text-muted-foreground flex h-64 items-center justify-center rounded-2xl border text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="size-5" /> {s.address}
                </span>
              </div>
            )}
          </div>

          <div className="border-sage-200 rounded-2xl border bg-card p-6 sm:p-8">
            <h2 className="text-sage-900 mb-6 text-xl font-semibold">Mesaj gönderin</h2>
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  )
}
