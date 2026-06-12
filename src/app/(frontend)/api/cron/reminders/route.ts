import { getPayloadClient } from '@/lib/payload'
import { istanbulDatePlusDays } from '@/lib/slots'
import { sendReminder } from '@/lib/notifications/appointments'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Vercel Cron (günlük) → yarın tarihli, confirmed, hatırlatması gönderilmemiş randevulara
// 24s hatırlatma gönderir. Idempotent (reminderSent işaretlenir).
export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = istanbulDatePlusDays(1)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'appointments',
    where: {
      and: [
        { date: { equals: tomorrow } },
        { status: { equals: 'confirmed' } },
        { reminderSent: { equals: false } },
      ],
    },
    limit: 500,
    depth: 0,
  })

  let sent = 0
  for (const a of docs) {
    try {
      await sendReminder(payload, a as never)
      await payload.update({
        collection: 'appointments',
        id: a.id,
        data: { reminderSent: true },
      })
      sent++
    } catch (e) {
      payload.logger.error({ msg: '[cron] hatırlatma hatası', id: a.id, err: e })
    }
  }

  return Response.json({ ok: true, date: tomorrow, found: docs.length, sent })
}
