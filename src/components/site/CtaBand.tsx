import Link from 'next/link'
import { Phone } from 'lucide-react'

import { getSiteSettings } from '@/lib/payload'
import { Button } from '@/components/ui/button'
import { Container } from './Container'
import { Section } from './Section'

export async function CtaBand({
  title = 'Sağlıklı bir yolculuğa bugün başla',
  description = 'Online ya da Ankara’da yüz yüze; sana en uygun şekilde başlayalım.',
}: {
  title?: string
  description?: string
}) {
  const s = await getSiteSettings()
  return (
    <Section>
      <Container>
        <div className="bg-sage-900 text-sage-50 flex flex-col items-center gap-6 rounded-3xl px-6 py-14 text-center sm:px-12">
          <h2 className="font-display max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="text-sage-200 max-w-xl">{description}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/randevu">Online randevu al</Link>
            </Button>
            {s.phone ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-sage-50/30 text-sage-50 hover:bg-sage-50/10 hover:text-sage-50 bg-transparent"
              >
                <a href={`tel:${s.phone.replace(/\s/g, '')}`}>
                  <Phone />
                  {s.phone}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  )
}
