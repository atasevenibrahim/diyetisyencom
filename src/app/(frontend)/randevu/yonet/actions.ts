'use server'

import {
  getActiveAppointmentsForDate,
  getAvailability,
  getPayloadClient,
  getScheduleExceptions,
} from '@/lib/payload'
import { computeAvailableSlots, type ScheduleException } from '@/lib/slots'

export type ManageState = {
  ok: boolean
  error?: string
  done?: 'cancelled' | 'rescheduled'
  date?: string
  startTime?: string
}

const ACTIVE = ['pending', 'confirmed']

export async function cancelByToken(_prev: ManageState, formData: FormData): Promise<ManageState> {
  const token = String(formData.get('token') ?? '')
  if (!token) return { ok: false, error: 'Geçersiz bağlantı.' }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointments',
    where: { cancelToken: { equals: token } },
    limit: 1,
    depth: 0,
  })
  const appt = docs[0]
  if (!appt) return { ok: false, error: 'Randevu bulunamadı.' }
  if (appt.status === 'cancelled') return { ok: true, done: 'cancelled' }
  if (!ACTIVE.includes(appt.status)) {
    return { ok: false, error: 'Bu randevu iptal edilemez.' }
  }

  await payload.update({
    collection: 'appointments',
    id: appt.id,
    data: { status: 'cancelled' },
  })
  return { ok: true, done: 'cancelled' }
}

export async function rescheduleByToken(
  _prev: ManageState,
  formData: FormData,
): Promise<ManageState> {
  const token = String(formData.get('token') ?? '')
  const date = String(formData.get('date') ?? '')
  const startTime = String(formData.get('startTime') ?? '')

  if (!token) return { ok: false, error: 'Geçersiz bağlantı.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    return { ok: false, error: 'Lütfen yeni bir tarih ve saat seçin.' }
  }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointments',
    where: { cancelToken: { equals: token } },
    limit: 1,
    depth: 0,
  })
  const appt = docs[0]
  if (!appt) return { ok: false, error: 'Randevu bulunamadı.' }
  if (!ACTIVE.includes(appt.status)) {
    return { ok: false, error: 'Bu randevu ertelenemez.' }
  }

  const typeId =
    typeof appt.appointmentType === 'object' ? appt.appointmentType?.id : appt.appointmentType
  const type = typeId
    ? await payload.findByID({ collection: 'appointment-types', id: typeId }).catch(() => null)
    : null
  if (!type?.durationMin) return { ok: false, error: 'Görüşme türü bulunamadı.' }

  // Slotu doğrula — bu randevunun kendi mevcut slotunu meşgul sayma.
  const [availability, exceptionsDocs, appointments] = await Promise.all([
    getAvailability(),
    getScheduleExceptions(),
    getActiveAppointmentsForDate(date),
  ])
  const exceptions: ScheduleException[] = exceptionsDocs.map((e) => ({
    date: e.date,
    type: e.type,
    start: e.start,
    end: e.end,
  }))
  const slots = computeAvailableSlots({
    date,
    durationMin: type.durationMin,
    availability,
    exceptions,
    appointments: appointments
      .filter((a) => a.id !== appt.id)
      .map((a) => ({ startTime: a.startTime, durationMin: a.durationMin })),
  })
  if (!slots.includes(startTime)) {
    return { ok: false, error: 'Seçtiğiniz saat uygun değil. Lütfen başka bir saat seçin.' }
  }

  try {
    await payload.update({
      collection: 'appointments',
      id: appt.id,
      data: { date, startTime },
    })
    return { ok: true, done: 'rescheduled', date, startTime }
  } catch {
    return { ok: false, error: 'Bu saat az önce dolmuş olabilir. Lütfen başka bir saat seçin.' }
  }
}
