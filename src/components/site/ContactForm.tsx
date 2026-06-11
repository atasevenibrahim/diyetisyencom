'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { submitContact, type ContactState } from '@/app/(frontend)/iletisim/actions'
import { Button } from '@/components/ui/button'

const initialState: ContactState = { ok: false }

const fieldClass =
  'w-full rounded-lg border border-sage-200 bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-sage-500 focus-visible:ring-2 focus-visible:ring-ring/40'

const labelClass = 'text-sage-900 text-sm font-medium'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  if (state.ok) {
    return (
      <div className="border-sage-200 bg-sage-50 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
        <CheckCircle2 className="text-sage-700 size-10" />
        <h3 className="text-sage-900 text-lg font-semibold">Mesajınız alındı</h3>
        <p className="text-muted-foreground text-sm">
          En kısa sürede size geri dönüş yapacağız. Teşekkürler!
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Ad Soyad *
        </label>
        <input id="name" name="name" required className={fieldClass} autoComplete="name" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClass}>
            E-posta
          </label>
          <input id="email" name="email" type="email" className={fieldClass} autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input id="phone" name="phone" className={fieldClass} autoComplete="tel" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className={labelClass}>
          Konu
        </label>
        <input id="subject" name="subject" className={fieldClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Mesaj *
        </label>
        <textarea id="message" name="message" required rows={5} className={fieldClass} />
      </div>

      <label className="text-muted-foreground flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="accent-sage-700 mt-1 size-4 shrink-0"
        />
        <span>
          <Link href="/kvkk" className="text-sage-700 underline underline-offset-2">
            KVKK Aydınlatma Metni
          </Link>
          ’ni okudum, kişisel verilerimin işlenmesini onaylıyorum. *
        </span>
      </label>

      {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <div>
        <Button type="submit" variant="accent" size="lg" disabled={pending}>
          {pending ? 'Gönderiliyor…' : 'Mesajı gönder'}
        </Button>
      </div>
    </form>
  )
}
