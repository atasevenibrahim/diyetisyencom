'use server'

import {
  getActiveAppointmentsForDate,
  getAvailability,
  getPayloadClient,
  getScheduleExceptions,
} from '@/lib/payload'
import { computeAvailableSlots, type ScheduleException } from '@/lib/slots'

export type BookingState = {
  ok: boolean
  error?: string
  confirmation?: { date: string; startTime: string; typeName: string; channel: string }
}

export async function createAppointment(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const typeId = Number(formData.get('appointmentType'))
  const channel = String(formData.get('channel') ?? '')
  const date = String(formData.get('date') ?? '')
  const startTime = String(formData.get('startTime') ?? '')
  const clientName = String(formData.get('clientName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()
  const consent = formData.get('consent') === 'on'

  if (!typeId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    return { ok: false, error: 'Lütfen tür, tarih ve saat seçin.' }
  }
  if (!clientName || !phone) {
    return { ok: false, error: 'Lütfen ad soyad ve telefon bilgilerinizi girin.' }
  }
  if (!['online', 'in_person'].includes(channel)) {
    return { ok: false, error: 'Lütfen görüşme kanalını seçin.' }
  }
  if (!consent) {
    return { ok: false, error: 'Devam etmek için KVKK açık rıza onayı gereklidir.' }
  }

  const payload = await getPayloadClient()
  const type = await payload
    .findByID({ collection: 'appointment-types', id: typeId })
    .catch(() => null)
  if (!type || !type.durationMin) {
    return { ok: false, error: 'Görüşme türü bulunamadı.' }
  }

  // Slotu yeniden doğrula (booking ile create arası boşlukta dolmuş olabilir)
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
    appointments: appointments.map((a) => ({ startTime: a.startTime, durationMin: a.durationMin })),
  })
  if (!slots.includes(startTime)) {
    return { ok: false, error: 'Seçtiğiniz saat artık uygun değil. Lütfen başka bir saat seçin.' }
  }

  try {
    await payload.create({
      collection: 'appointments',
      data: {
        appointmentType: typeId,
        channel: channel as 'online' | 'in_person',
        clientName,
        phone,
        email: email || undefined,
        date,
        startTime,
        durationMin: type.durationMin,
        status: 'pending',
        notes: notes || undefined,
        kvkkConsent: true,
        paymentStatus: 'none',
      },
    })
    return {
      ok: true,
      confirmation: { date, startTime, typeName: type.name, channel },
    }
  } catch {
    // slotKey unique ihlali → eşzamanlı rezervasyon
    return {
      ok: false,
      error: 'Bu saat az önce dolmuş olabilir. Lütfen başka bir saat seçin.',
    }
  }
}
