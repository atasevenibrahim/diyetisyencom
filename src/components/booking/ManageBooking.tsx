'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarClock, CheckCircle2, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  cancelByToken,
  rescheduleByToken,
  type ManageState,
} from '@/app/(frontend)/randevu/yonet/actions'

const channelLabel = (c: string) => (c === 'online' ? 'Online' : 'Yüz yüze')

const fieldClass =
  'w-full max-w-xs rounded-lg border border-sage-200 bg-card px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-sage-500 focus-visible:ring-2 focus-visible:ring-ring/40'

const init: ManageState = { ok: false }

function formatTrDate(date: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00+03:00`))
}

export function ManageBooking(props: {
  token: string
  typeId: number
  typeName: string
  date: string
  startTime: string
  channel: string
  durationMin: number
  today: string
  maxDate: string
}) {
  const [mode, setMode] = useState<'view' | 'reschedule'>('view')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const [cancelState, cancelAction, cancelPending] = useActionState(cancelByToken, init)
  const [reschedState, reschedAction, reschedPending] = useActionState(rescheduleByToken, init)

  const done = cancelState.done || reschedState.done
  if (done) {
    const rescheduled = reschedState.done === 'rescheduled'
    return (
      <div className="border-sage-200 bg-card mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        {rescheduled ? (
          <CheckCircle2 className="text-sage-700 size-12" />
        ) : (
          <XCircle className="text-sage-700 size-12" />
        )}
        <h2 className="text-sage-900 text-2xl font-semibold">
          {rescheduled ? 'Randevunuz ertelendi' : 'Randevunuz iptal edildi'}
        </h2>
        {rescheduled && reschedState.date ? (
          <p className="text-muted-foreground text-sm">
            Yeni randevu: {formatTrDate(reschedState.date)} · Saat {reschedState.startTime}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Dilediğiniz zaman yeni bir randevu oluşturabilirsiniz.
          </p>
        )}
        <Button asChild variant="outline">
          <Link href="/">Anasayfaya dön</Link>
        </Button>
      </div>
    )
  }

  const loadSlots = async (d: string) => {
    setDate(d)
    setStartTime('')
    setSlots([])
    if (!d) return
    setLoading(true)
    try {
      const res = await fetch(`/api/availability/slots?type=${props.typeId}&date=${d}`)
      const json = await res.json()
      setSlots(Array.isArray(json.slots) ? json.slots : [])
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="border-sage-200 bg-sage-50 flex flex-col gap-1 rounded-2xl border px-5 py-4 text-sm">
        <span className="text-sage-900 font-semibold">{props.typeName}</span>
        <span className="text-ink">{formatTrDate(props.date)}</span>
        <span className="text-ink">
          Saat {props.startTime} · {channelLabel(props.channel)} · {props.durationMin} dk
        </span>
      </div>

      {mode === 'view' ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="accent" onClick={() => setMode('reschedule')}>
            <CalendarClock /> Ertele
          </Button>
          <form action={cancelAction}>
            <input type="hidden" name="token" value={props.token} />
            <Button type="submit" variant="outline" disabled={cancelPending}>
              {cancelPending ? 'İptal ediliyor…' : 'Randevuyu iptal et'}
            </Button>
          </form>
        </div>
      ) : (
        <form action={reschedAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={props.token} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="startTime" value={startTime} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newdate" className="text-sage-900 text-sm font-medium">
              Yeni tarih
            </label>
            <input
              id="newdate"
              type="date"
              min={props.today}
              max={props.maxDate}
              value={date}
              onChange={(e) => loadSlots(e.target.value)}
              className={fieldClass}
            />
          </div>

          {date ? (
            loading ? (
              <p className="text-muted-foreground text-sm">Müsait saatler yükleniyor…</p>
            ) : slots.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStartTime(s)}
                    className={cn(
                      'rounded-lg border px-3.5 py-2 text-sm font-medium',
                      startTime === s
                        ? 'border-sage-700 bg-sage-700 text-primary-foreground'
                        : 'border-sage-200 text-sage-900 hover:border-sage-500',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Bu gün için uygun saat yok.</p>
            )
          ) : null}

          {reschedState.error ? (
            <p className="text-destructive text-sm">{reschedState.error}</p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setMode('view')}>
              Vazgeç
            </Button>
            <Button type="submit" variant="accent" disabled={!date || !startTime || reschedPending}>
              {reschedPending ? 'Erteleniyor…' : 'Yeni saati onayla'}
              <ArrowRight />
            </Button>
          </div>
        </form>
      )}

      {cancelState.error ? <p className="text-destructive text-sm">{cancelState.error}</p> : null}
    </div>
  )
}
