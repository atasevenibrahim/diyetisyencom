'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Clock, Info } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createAppointment, type BookingState } from '@/app/(frontend)/randevu/actions'

export type AppointmentTypeLite = {
  id: number
  name: string
  durationMin: number
  channel: 'online' | 'in_person' | 'both'
  description?: string | null
}

const channelLabel = (c: string) => (c === 'online' ? 'Online' : 'Yüz yüze')

const fieldClass =
  'w-full rounded-lg border border-sage-200 bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-sage-500 focus-visible:ring-2 focus-visible:ring-ring/40'
const labelClass = 'text-sage-900 text-sm font-medium'

const initialState: BookingState = { ok: false }

function formatTrDate(date: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00+03:00`))
}

export function BookingFlow({
  types,
  today,
  maxDate,
  lateToleranceMin,
}: {
  types: AppointmentTypeLite[]
  today: string
  maxDate: string
  lateToleranceMin: number
}) {
  const [step, setStep] = useState(1)
  const [typeId, setTypeId] = useState<number | null>(null)
  const [channel, setChannel] = useState<'online' | 'in_person' | ''>('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [state, formAction, pending] = useActionState(createAppointment, initialState)

  const selectedType = types.find((t) => t.id === typeId) ?? null

  const selectType = (t: AppointmentTypeLite) => {
    setTypeId(t.id)
    setChannel(t.channel === 'both' ? '' : t.channel)
    setDate('')
    setStartTime('')
    setSlots([])
  }

  const loadSlots = async (d: string) => {
    setDate(d)
    setStartTime('')
    setSlots([])
    if (!d || !typeId) return
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/availability/slots?type=${typeId}&date=${d}`)
      const json = await res.json()
      setSlots(Array.isArray(json.slots) ? json.slots : [])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  // --- Onay ekranı ---
  if (state.ok && state.confirmation) {
    const c = state.confirmation
    return (
      <div className="border-sage-200 bg-card mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <CheckCircle2 className="text-sage-700 size-12" />
        <h2 className="text-sage-900 text-2xl font-semibold">Randevu talebiniz alındı</h2>
        <div className="bg-sage-50 text-ink flex flex-col gap-1 rounded-xl px-6 py-4 text-sm">
          <span className="font-medium">{c.typeName}</span>
          <span>{formatTrDate(c.date)}</span>
          <span>
            Saat {c.startTime} · {channelLabel(c.channel)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Talebiniz <strong>onay bekliyor</strong>. En kısa sürede sizinle iletişime geçip
          randevunuzu kesinleştireceğiz.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Anasayfaya dön</Link>
        </Button>
      </div>
    )
  }

  const steps = ['Görüşme türü', 'Tarih & saat', 'Bilgiler']

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      {/* adım göstergesi */}
      <ol className="flex items-center justify-center gap-2 text-sm">
        {steps.map((label, i) => {
          const n = i + 1
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                  step >= n
                    ? 'bg-sage-700 text-primary-foreground'
                    : 'bg-sage-50 text-muted-foreground',
                )}
              >
                {n}
              </span>
              <span className={cn('hidden sm:inline', step === n ? 'text-sage-900' : 'text-muted-foreground')}>
                {label}
              </span>
              {n < steps.length ? <span className="text-sage-200">—</span> : null}
            </li>
          )
        })}
      </ol>

      {/* Adım 1: tür + kanal */}
      {step === 1 ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectType(t)}
                className={cn(
                  'flex flex-col gap-2 rounded-2xl border p-5 text-left transition-all',
                  typeId === t.id
                    ? 'border-sage-700 ring-1 ring-sage-700'
                    : 'border-sage-200 hover:border-sage-500',
                )}
              >
                <span className="text-sage-900 font-semibold">{t.name}</span>
                <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                  <Clock className="size-3.5" /> {t.durationMin} dk
                </span>
                {t.description ? (
                  <span className="text-muted-foreground text-sm">{t.description}</span>
                ) : null}
              </button>
            ))}
          </div>

          {selectedType && selectedType.channel === 'both' ? (
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Görüşme kanalı</span>
              <div className="flex gap-3">
                {(['in_person', 'online'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      channel === c
                        ? 'border-sage-700 bg-sage-50 text-sage-900'
                        : 'border-sage-200 text-muted-foreground hover:border-sage-500',
                    )}
                  >
                    {channelLabel(c)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="accent"
              size="lg"
              disabled={!typeId || !channel}
              onClick={() => setStep(2)}
            >
              Devam <ArrowRight />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Adım 2: tarih + slot */}
      {step === 2 ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className={labelClass}>
              Tarih seçin
            </label>
            <input
              id="date"
              type="date"
              min={today}
              max={maxDate}
              value={date}
              onChange={(e) => loadSlots(e.target.value)}
              className={cn(fieldClass, 'max-w-xs')}
            />
          </div>

          {date ? (
            loadingSlots ? (
              <p className="text-muted-foreground text-sm">Müsait saatler yükleniyor…</p>
            ) : slots.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className={labelClass}>Müsait saatler</span>
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStartTime(s)}
                      className={cn(
                        'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                        startTime === s
                          ? 'border-sage-700 bg-sage-700 text-primary-foreground'
                          : 'border-sage-200 text-sage-900 hover:border-sage-500',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Bu gün için uygun saat bulunmuyor. Lütfen başka bir gün seçin.
              </p>
            )
          ) : null}

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft /> Geri
            </Button>
            <Button
              type="button"
              variant="accent"
              size="lg"
              disabled={!date || !startTime}
              onClick={() => setStep(3)}
            >
              Devam <ArrowRight />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Adım 3: bilgiler + onay */}
      {step === 3 && selectedType ? (
        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="appointmentType" value={selectedType.id} />
          <input type="hidden" name="channel" value={channel} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="startTime" value={startTime} />

          <div className="bg-sage-50 text-ink flex flex-col gap-1 rounded-xl px-5 py-4 text-sm">
            <span className="font-medium">{selectedType.name}</span>
            <span>{formatTrDate(date)}</span>
            <span>
              Saat {startTime} · {channelLabel(channel)} · {selectedType.durationMin} dk
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="clientName" className={labelClass}>
                Ad Soyad *
              </label>
              <input id="clientName" name="clientName" required className={fieldClass} autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className={labelClass}>
                Telefon *
              </label>
              <input id="phone" name="phone" required className={fieldClass} autoComplete="tel" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClass}>
              E-posta
            </label>
            <input id="email" name="email" type="email" className={fieldClass} autoComplete="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className={labelClass}>
              Eklemek istedikleriniz
            </label>
            <textarea id="notes" name="notes" rows={3} className={fieldClass} />
          </div>

          <label className="text-muted-foreground flex items-start gap-2 text-sm">
            <input type="checkbox" name="consent" required className="accent-sage-700 mt-1 size-4 shrink-0" />
            <span>
              <Link href="/kvkk" className="text-sage-700 underline underline-offset-2">
                KVKK Aydınlatma Metni
              </Link>
              ’ni okudum; sağlık verilerim dahil kişisel verilerimin işlenmesine açık rıza
              veriyorum. *
            </span>
          </label>

          <p className="text-muted-foreground flex items-start gap-2 text-xs">
            <Info className="text-sage-500 mt-0.5 size-4 shrink-0" />
            Randevu saatinden en fazla {lateToleranceMin} dakika gecikme tolere edilir. Talebiniz
            onaylandığında sizinle iletişime geçilecektir.
          </p>

          {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft /> Geri
            </Button>
            <Button type="submit" variant="accent" size="lg" disabled={pending}>
              <CalendarCheck />
              {pending ? 'Gönderiliyor…' : 'Randevu talebini gönder'}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
