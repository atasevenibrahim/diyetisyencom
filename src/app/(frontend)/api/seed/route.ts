import { getPayload } from 'payload'

import config from '@payload-config'
import { runSeed } from '@/seed/seed'

// Geliştirme-içi seed endpoint'i. Üretimde 403; ayrıca ?secret=PAYLOAD_SECRET ister.
// (payload CLI runner Windows/tsx'te node:crypto hatası verdiği için Next runtime kullanılır.)
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Seed yalnızca geliştirmede çalışır.' }, { status: 403 })
  }
  const secret = new URL(req.url).searchParams.get('secret')
  if (!secret || secret !== process.env.PAYLOAD_SECRET) {
    return Response.json({ error: 'Geçersiz secret.' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const counts = await runSeed(payload)
  return Response.json({ ok: true, counts })
}
