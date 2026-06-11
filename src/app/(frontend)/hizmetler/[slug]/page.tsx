import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getServiceBySlug, getServices } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { RichText } from '@/components/site/RichText'
import { CtaBand } from '@/components/site/CtaBand'
import { Button } from '@/components/ui/button'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.seo?.title || service.title,
    description: service.seo?.description || service.summary,
  }
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <>
      <PageHeader eyebrow="Hizmet" title={service.title} description={service.summary} />
      <Section>
        <Container className="max-w-3xl">
          {service.body ? (
            <RichText data={service.body} className="prose prose-lg max-w-none" />
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/randevu">Randevu al</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/hizmetler">Tüm hizmetler</Link>
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  )
}
