import { getPayloadClient, getSiteSettings } from '@/lib/payload'
import { SITE_NAME } from '@/lib/site'
import type {
  ChannelKey,
  NotificationConfig,
  NotificationData,
  NotificationEvent,
} from './types'
import { renderEmail, renderSms } from './templates'
import { emailEnabled, sendEmail } from './channels/email'
import { sendSms, smsEnabled } from './channels/sms'
import { sendWhatsapp, whatsappEnabled } from './channels/whatsapp'

const ALL_EVENTS: NotificationEvent[] = [
  'requested',
  'confirmed',
  'cancelled',
  'rescheduled',
  'reminder',
  'admin_new',
]

function buildToggles(
  emailEvents: string[],
  smsEvents: string[],
  whatsappEvents: string[],
): NotificationConfig['toggles'] {
  const out = {} as NotificationConfig['toggles']
  for (const e of ALL_EVENTS) {
    out[e] = {
      email: emailEvents.includes(e),
      sms: smsEvents.includes(e),
      whatsapp: whatsappEvents.includes(e),
    }
  }
  return out
}

export async function getNotificationConfig(): Promise<NotificationConfig> {
  const payload = await getPayloadClient()
  const g = (await payload.findGlobal({ slug: 'notifications' }).catch(() => null)) as {
    senderName?: string | null
    senderEmail?: string | null
    adminEmail?: string | null
    smsHeader?: string | null
    emailEvents?: string[] | null
    smsEvents?: string[] | null
    whatsappEvents?: string[] | null
  } | null
  const site = await getSiteSettings().catch(() => null)

  // Global henüz seed edilmemişse: e-posta tüm olaylarda açık, sms/whatsapp kapalı.
  const emailEvents = g?.emailEvents ?? ALL_EVENTS
  const smsEvents = g?.smsEvents ?? []
  const whatsappEvents = g?.whatsappEvents ?? []

  return {
    senderName: g?.senderName || SITE_NAME,
    senderEmail: g?.senderEmail || 'randevu@ozdenozgurdurukan.com',
    adminEmail: g?.adminEmail || site?.email || null,
    smsHeader: g?.smsHeader || process.env.NETGSM_HEADER || null,
    siteName: SITE_NAME,
    toggles: buildToggles(emailEvents, smsEvents, whatsappEvents),
  }
}

// Olayı etkin kanallara dağıtır. Her kanal izole; hiçbir hata randevu kaydını etkilemez.
export async function dispatch(data: NotificationData): Promise<void> {
  let config: NotificationConfig
  try {
    config = await getNotificationConfig()
  } catch (e) {
    console.error('[notify] config yüklenemedi', e)
    return
  }
  const t = config.toggles[data.event]
  const recipientEmail = data.event === 'admin_new' ? config.adminEmail : data.clientEmail

  if (t.email && emailEnabled() && recipientEmail) {
    try {
      const { subject, html } = renderEmail(data, config.siteName)
      await sendEmail({
        to: recipientEmail,
        from: `${config.senderName} <${config.senderEmail}>`,
        subject,
        html,
      })
    } catch (e) {
      console.error(`[notify] email error (${data.event})`, e)
    }
  }

  // SMS/WhatsApp danışana gider (admin_new hariç)
  if (data.event !== 'admin_new' && data.clientPhone) {
    if (t.sms && smsEnabled()) {
      try {
        await sendSms({ to: data.clientPhone, text: renderSms(data), header: config.smsHeader })
      } catch (e) {
        console.error(`[notify] sms error (${data.event})`, e)
      }
    }
    if (t.whatsapp && whatsappEnabled()) {
      try {
        await sendWhatsapp({ to: data.clientPhone, text: renderSms(data) })
      } catch (e) {
        console.error(`[notify] whatsapp error (${data.event})`, e)
      }
    }
  }
}

export type { ChannelKey }
