import {
  getActiveAppointmentsForDate,
  getAvailability,
  getPayloadClient,
  getScheduleExceptions,
} from '@/lib/payload'
import { computeAvailableSlots, type ScheduleException } from '@/lib/slots'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const typeId = url.searchParams.get('type')
  const date = url.searchParams.get('date')

  if (!typeId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ slots: [] }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const type = await payload
    .findByID({ collection: 'appointment-types', id: Number(typeId) })
    .catch(() => null)

  if (!type || !type.durationMin) {
    return Response.json({ slots: [] })
  }

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

  return Response.json({ slots, durationMin: type.durationMin })
}
