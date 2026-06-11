// Dinamik slot hesaplama. Türkiye kalıcı olarak UTC+3 (DST yok) → sabit offset.
const ISTANBUL_OFFSET = '+03:00'
const DAY_MS = 86_400_000

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export type WeeklyDay = {
  day?: string | null
  enabled?: boolean | null
  start?: string | null
  end?: string | null
}

export type AvailabilityConfig = {
  weekly?: WeeklyDay[] | null
  slotIntervalMin?: number | null
  bufferMin?: number | null
  minLeadHours?: number | null
  maxAdvanceDays?: number | null
}

export type ScheduleException = {
  date: string
  type: 'closed' | 'custom'
  start?: string | null
  end?: string | null
}

export type BusyAppointment = { startTime?: string | null; durationMin?: number | null }

const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const toHHMM = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

const slotEpoch = (date: string, hhmm: string): number =>
  Date.parse(`${date}T${hhmm}:00${ISTANBUL_OFFSET}`)

/** Bir tarihin Europe/Istanbul gününe göre haftanın günü anahtarı (mon..sun). */
export const istanbulDayKey = (date: string): string =>
  dayKeys[new Date(`${date}T12:00:00${ISTANBUL_OFFSET}`).getUTCDay()]

/** Bugünün Europe/Istanbul tarihi (YYYY-MM-DD). */
export const todayIstanbul = (): string =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' })

/** Bugünden N gün sonrasının Europe/Istanbul tarihi (YYYY-MM-DD). */
export const istanbulDatePlusDays = (days: number): string =>
  new Date(Date.now() + days * DAY_MS).toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' })

export function computeAvailableSlots(params: {
  date: string
  durationMin: number
  availability: AvailabilityConfig
  exceptions: ScheduleException[]
  appointments: BusyAppointment[]
  now?: number
}): string[] {
  const { date, durationMin, availability, exceptions, appointments } = params
  const now = params.now ?? Date.now()

  const interval = availability.slotIntervalMin || 30
  const buffer = availability.bufferMin || 0
  const minLeadMs = (availability.minLeadHours ?? 3) * 3_600_000
  const maxAdvanceDays = availability.maxAdvanceDays ?? 60

  // Maks. ileri tarih kontrolü
  if (slotEpoch(date, '00:00') > now + maxAdvanceDays * DAY_MS) return []

  // Pencereyi belirle: istisna varsa o, yoksa haftalık
  let windowStart: number | null = null
  let windowEnd: number | null = null

  const exc = exceptions.find((e) => e.date === date)
  if (exc) {
    if (exc.type === 'closed') return []
    if (exc.type === 'custom' && exc.start && exc.end) {
      windowStart = toMin(exc.start)
      windowEnd = toMin(exc.end)
    }
  }

  if (windowStart === null || windowEnd === null) {
    const wd = istanbulDayKey(date)
    const day = (availability.weekly ?? []).find((d) => d.day === wd)
    if (!day || !day.enabled || !day.start || !day.end) return []
    windowStart = toMin(day.start)
    windowEnd = toMin(day.end)
  }

  const busy = appointments
    .filter((a) => a.startTime && a.durationMin)
    .map((a) => {
      const s = toMin(a.startTime as string)
      return { s, e: s + (a.durationMin as number) }
    })

  const slots: string[] = []
  for (let t = windowStart; t + durationMin <= windowEnd; t += interval) {
    const slotEnd = t + durationMin
    const conflict = busy.some((b) => t < b.e + buffer && slotEnd + buffer > b.s)
    if (conflict) continue
    if (slotEpoch(date, toHHMM(t)) < now + minLeadMs) continue
    slots.push(toHHMM(t))
  }
  return slots
}
