import type { Metadata } from 'next'

import { getDevices } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { DeviceCard } from '@/components/site/DeviceCard'
import { CtaBand } from '@/components/site/CtaBand'

export const metadata: Metadata = {
  title: 'Cihazlar',
  description:
    'Andulasyon Terapisi, EMS ve RollShine ile bölgesel incelme, vücut şekillendirme ve genel iyilik desteği.',
}

export default async function CihazlarPage() {
  const devices = await getDevices()
  return (
    <>
      <PageHeader
        eyebrow="Teknoloji Desteği"
        title="Cihazlar"
        description="Beslenme programını destekleyen, bölgesel incelme ve vücut şekillendirmeye yardımcı teknolojiler."
      />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  )
}
