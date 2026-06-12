import type { Metadata } from 'next'

import { getAppointmentByToken, getAvailability } from '@/lib/payload'
import { istanbulDatePlusDays, todayIstanbul } from '@/lib/slots'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { ManageBooking } from '@/components/booking/ManageBooking'

export const metadata: Metadata = {
  title: 'Randevu Yönetimi',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ token: string }> }

const statusLabel: Record<string, string> = {
  cancelled: 'Bu randevu iptal edilmiş.',
  completed: 'Bu randevu tamamlanmış.',
  no_show: 'Bu randevu kapatılmış.',
  rescheduled: 'Bu randevu ertelenmiş.',
}

export default async function ManagePage({ params }: Params) {
  const { token } = await params
  const appt = await getAppointmentByToken(token)

  if (!appt) {
    return (
      <>
        <PageHeader eyebrow="Randevu" title="Randevu bulunamadı" />
        <Section>
          <Container>
            <p className="text-muted-foreground">
              Bağlantı geçersiz olabilir. Lütfen e-postanızdaki güncel bağlantıyı kullanın.
            </p>
          </Container>
        </Section>
      </>
    )
  }

  const typeName =
    typeof appt.appointmentType === 'object' && appt.appointmentType
      ? appt.appointmentType.name
      : 'Görüşme'
  const typeId =
    typeof appt.appointmentType === 'object' && appt.appointmentType
      ? appt.appointmentType.id
      : (appt.appointmentType as number)

  const manageable = appt.status === 'pending' || appt.status === 'confirmed'
  const availability = await getAvailability()

  return (
    <>
      <PageHeader
        eyebrow="Randevu Yönetimi"
        title="Randevunuz"
        description="Randevunuzu buradan iptal edebilir veya yeni bir tarihe erteleyebilirsiniz."
      />
      <Section>
        <Container>
          {manageable ? (
            <ManageBooking
              token={token}
              typeId={typeId}
              typeName={typeName}
              date={appt.date}
              startTime={appt.startTime}
              channel={appt.channel}
              durationMin={appt.durationMin}
              today={todayIstanbul()}
              maxDate={istanbulDatePlusDays(availability.maxAdvanceDays ?? 60)}
            />
          ) : (
            <p className="text-muted-foreground mx-auto max-w-xl text-center">
              {statusLabel[appt.status] ?? 'Bu randevu üzerinde işlem yapılamıyor.'}
            </p>
          )}
        </Container>
      </Section>
    </>
  )
}
