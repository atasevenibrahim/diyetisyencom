import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Sparkles } from 'lucide-react'

import { getDeviceBySlug, getDevices } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { CtaBand } from '@/components/site/CtaBand'
import { Button } from '@/components/ui/button'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const devices = await getDevices()
  return devices.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const device = await getDeviceBySlug(slug)
  if (!device) return {}
  return {
    title: device.name,
    description: device.tagline || `${device.name} hakkında detaylı bilgi.`,
  }
}

export default async function DeviceDetailPage({ params }: Params) {
  const { slug } = await params
  const device = await getDeviceBySlug(slug)
  if (!device) notFound()

  const benefits = device.benefits ?? []

  return (
    <>
      <PageHeader eyebrow="Cihaz" title={device.name} description={device.tagline ?? undefined} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="from-sage-200 to-sage-50 flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br">
              <span className="bg-card/70 text-sage-700 flex size-16 items-center justify-center rounded-full">
                <Sparkles className="size-8" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {device.description ? (
              <RichText data={device.description} className="prose max-w-none" />
            ) : null}
            {benefits.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-sage-900 text-lg font-semibold">Faydaları</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {benefits.map((b, i) => (
                    <li key={i} className="text-ink flex items-start gap-2 text-sm">
                      <Check className="text-sage-700 mt-0.5 size-4 shrink-0" />
                      {b.benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/randevu">Randevu al</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cihazlar">Tüm cihazlar</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  )
}
