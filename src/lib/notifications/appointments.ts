import type { Payload } from 'payload'

import { absoluteUrl } from '@/lib/site'
import { dispatch } from './service'
import type { NotificationData, NotificationEvent } from './types'

type ApptDoc = {
  id: number | string
  status: string
  date: string
  startTime: string
  durationMin: number
  channel: 'online' | 'in_person'
  clientName: string
  phone?: string | null
  email?: string | null
  appointmentType: number | { id: number; name?: string } | null
  cancelToken?: string | null
}

async function buildBase(payload: Payload, doc: ApptDoc): Promise<Omit<NotificationData, 'event'>> {
  let typeName = 'Görüşme'
  try {
    const typeId = typeof doc.appointmentType === 'object' ? doc.appointmentType?.id : doc.appointmentType
    if (typeId) {
      const at = await payload.findByID({ collection: 'appointment-types', id: typeId, depth: 0 })
      if (at?.name) typeName = at.name
    }
  } catch {
    // tür adı çözülemezse varsayılan kullanılır
  }

  return {
    clientName: doc.clientName,
    clientEmail: doc.email,
    clientPhone: doc.phone,
    typeName,
    date: doc.date,
    startTime: doc.startTime,
    durationMin: doc.durationMin,
    channel: doc.channel,
    manageUrl: doc.cancelToken ? absoluteUrl(`/randevu/yonet/${doc.cancelToken}`) : null,
    adminUrl: absoluteUrl(`/admin/collections/appointments/${doc.id}`),
  }
}

// afterChange'den çağrılır: statü/tarih geçişine göre olayları belirler ve dağıtır.
export async function notifyAppointmentChange(args: {
  payload: Payload
  doc: ApptDoc
  previousDoc?: ApptDoc
  operation: 'create' | 'update'
}): Promise<void> {
  const { payload, doc, previousDoc, operation } = args

  let events: NotificationEvent[] = []
  if (operation === 'create') {
    events = ['requested', 'admin_new']
  } else if (previousDoc) {
    if (doc.status === 'cancelled' && previousDoc.status !== 'cancelled') {
      events = ['cancelled']
    } else if (
      (doc.date !== previousDoc.date || doc.startTime !== previousDoc.startTime) &&
      ['pending', 'confirmed'].includes(doc.status)
    ) {
      events = ['rescheduled']
    } else if (doc.status === 'confirmed' && previousDoc.status !== 'confirmed') {
      events = ['confirmed']
    }
  }
  if (events.length === 0) return

  const base = await buildBase(payload, doc)
  for (const event of events) {
    await dispatch({ ...base, event })
  }
}

// 24s hatırlatma cron'undan çağrılır.
export async function sendReminder(payload: Payload, doc: ApptDoc): Promise<void> {
  const base = await buildBase(payload, doc)
  await dispatch({ ...base, event: 'reminder' })
}
