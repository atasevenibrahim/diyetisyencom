'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactState = { ok: boolean; error?: string }

// İletişim formu → contactSubmissions. (E-posta bildirimi Faz 3.)
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const consent = formData.get('consent') === 'on'

  if (!name || !message) {
    return { ok: false, error: 'Lütfen ad ve mesaj alanlarını doldurun.' }
  }
  if (!email && !phone) {
    return { ok: false, error: 'E-posta veya telefon bilgilerinden en az birini girin.' }
  }
  if (!consent) {
    return { ok: false, error: 'Devam etmek için KVKK aydınlatma metnini onaylayın.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
      },
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' }
  }
}
