import type { Metadata } from 'next'

import { getActiveAppointmentTypes, getAvailability } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { BookingFlow, type AppointmentTypeLite } from '@/components/booking/BookingFlow'
import { istanbulDatePlusDays, todayIstanbul } from '@/lib/slots'

export const metadata: Metadata = {
  title: 'Online Randevu',
  description:
    'Uzm. Dyt. Özden Özgür Durukan ile online veya yüz yüze randevunuzu birkaç adımda oluşturun.',
}

export const dynamic = 'force-dynamic'

export default async function RandevuPage() {
  const [types, availability] = await Promise.all([getActiveAppointmentTypes(), getAvailability()])

  const liteTypes: AppointmentTypeLite[] = types.map((t) => ({
    id: t.id,
    name: t.name,
    durationMin: t.durationMin,
    channel: t.channel,
    description: t.description,
  }))

  const maxAdvanceDays = availability.maxAdvanceDays ?? 60
  const today = todayIstanbul()
  const maxDate = istanbulDatePlusDays(maxAdvanceDays)

  return (
    <>
      <PageHeader
        eyebrow="Online Randevu"
        title="Randevunuzu oluşturun"
        description="Görüşme türünü seçin, size uygun günü ve saati belirleyin; gerisini biz hallederiz."
      />
      <Section>
        <Container>
          {liteTypes.length > 0 ? (
            <BookingFlow
              types={liteTypes}
              today={today}
              maxDate={maxDate}
              lateToleranceMin={availability.lateToleranceMin ?? 5}
            />
          ) : (
            <p className="text-muted-foreground text-center">
              Şu anda online randevu türleri tanımlı değil. Lütfen telefon ile iletişime geçin.
            </p>
          )}
        </Container>
      </Section>
    </>
  )
}
