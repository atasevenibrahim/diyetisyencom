import type { Metadata } from 'next'

import { getServices } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { ServiceCard } from '@/components/site/ServiceCard'
import { CtaBand } from '@/components/site/CtaBand'

export const metadata: Metadata = {
  title: 'Hizmetler',
  description:
    'Kilo yönetimi, insülin direnci, PCOS, Haşimoto, gebelik beslenmesi, GLP-1 sürecinde beslenme ve daha fazlası — kişiye özel danışmanlık.',
}

export default async function HizmetlerPage() {
  const services = await getServices()
  return (
    <>
      <PageHeader
        eyebrow="Uzmanlık Alanları"
        title="Hizmetler"
        description="Her ihtiyaca özel, bilim temelli ve sürdürülebilir beslenme danışmanlığı."
      />
      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  )
}
