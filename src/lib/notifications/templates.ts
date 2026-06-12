import type { NotificationData } from './types'

const C = {
  sand: '#f7f4ed',
  sage900: '#2c3a31',
  sage700: '#4f6b58',
  sage50: '#eef2ec',
  ink: '#28302b',
  apricot: '#e59a6c',
  muted: '#55665b',
  border: '#c9d6cb',
}

const channelLabel = (c: string) => (c === 'online' ? 'Online' : 'Yüz yüze')

export const formatTrDate = (date: string): string =>
  new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(new Date(`${date}T12:00:00+03:00`))

function layout(opts: { siteName: string; heading: string; body: string }): string {
  return `<!doctype html><html lang="tr"><body style="margin:0;background:${C.sand};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
        <tr><td style="background:${C.sage700};padding:20px 28px;">
          <span style="color:#f4f7f2;font-size:16px;font-weight:600;">${opts.siteName}</span>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:${C.sage900};">${opts.heading}</h1>
          ${opts.body}
        </td></tr>
        <tr><td style="padding:18px 28px;background:${C.sage50};color:${C.muted};font-size:12px;">
          Bu e-posta randevunuzla ilgili otomatik bir bilgilendirmedir.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function detailsBox(data: NotificationData): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${C.sage50};border-radius:12px;margin:8px 0 20px;">
    <tr><td style="padding:16px 18px;font-size:14px;line-height:1.7;color:${C.ink};">
      <strong>${data.typeName}</strong><br/>
      ${formatTrDate(data.date)}<br/>
      Saat ${data.startTime} · ${channelLabel(data.channel)} · ${data.durationMin} dk
    </td></tr>
  </table>`
}

function button(href: string, label: string, color = C.sage700, text = '#ffffff'): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:${text};text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:10px;">${label}</a>`
}

const p = (t: string) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${C.ink};">${t}</p>`

export function renderEmail(
  data: NotificationData,
  siteName: string,
): { subject: string; html: string } {
  const manage = data.manageUrl
  const manageBtn = manage
    ? `<div style="margin-top:8px;">${button(manage, 'Randevumu yönet')}</div>`
    : ''

  switch (data.event) {
    case 'requested':
      return {
        subject: 'Randevu talebiniz alındı',
        html: layout({
          siteName,
          heading: 'Randevu talebiniz alındı',
          body:
            p(`Merhaba ${data.clientName}, randevu talebiniz bize ulaştı.`) +
            detailsBox(data) +
            p('Talebiniz <strong>onay bekliyor</strong>. Onaylandığında size tekrar bilgi vereceğiz.') +
            manageBtn,
        }),
      }
    case 'confirmed':
      return {
        subject: 'Randevunuz onaylandı',
        html: layout({
          siteName,
          heading: 'Randevunuz onaylandı ✓',
          body:
            p(`Merhaba ${data.clientName}, randevunuz onaylanmıştır.`) +
            detailsBox(data) +
            p('Randevu saatinden en fazla 5 dakika gecikme tolere edilmektedir.') +
            manageBtn,
        }),
      }
    case 'reminder':
      return {
        subject: 'Hatırlatma: yarın randevunuz var',
        html: layout({
          siteName,
          heading: 'Yarın randevunuz var',
          body:
            p(`Merhaba ${data.clientName}, yarınki randevunuzu hatırlatmak isteriz.`) +
            detailsBox(data) +
            manageBtn,
        }),
      }
    case 'rescheduled':
      return {
        subject: 'Randevunuz ertelendi',
        html: layout({
          siteName,
          heading: 'Randevunuz güncellendi',
          body:
            p(`Merhaba ${data.clientName}, randevunuz yeni tarihe taşınmıştır.`) +
            detailsBox(data) +
            manageBtn,
        }),
      }
    case 'cancelled':
      return {
        subject: 'Randevunuz iptal edildi',
        html: layout({
          siteName,
          heading: 'Randevunuz iptal edildi',
          body:
            p(`Merhaba ${data.clientName}, aşağıdaki randevunuz iptal edilmiştir.`) +
            detailsBox(data) +
            p('Dilediğiniz zaman yeni bir randevu oluşturabilirsiniz.'),
        }),
      }
    case 'admin_new':
      return {
        subject: `Yeni randevu talebi — ${data.clientName}`,
        html: layout({
          siteName,
          heading: 'Yeni randevu talebi',
          body:
            p(`<strong>${data.clientName}</strong> yeni bir randevu talebi oluşturdu.`) +
            detailsBox(data) +
            p(`İletişim: ${data.clientPhone || '-'}${data.clientEmail ? ' · ' + data.clientEmail : ''}`) +
            (data.adminUrl ? `<div style="margin-top:8px;">${button(data.adminUrl, 'Panelde onayla', C.apricot, '#3a2418')}</div>` : ''),
        }),
      }
  }
}

export function renderSms(data: NotificationData): string {
  const d = formatTrDate(data.date)
  switch (data.event) {
    case 'requested':
      return `Randevu talebiniz alindi: ${data.typeName}, ${d} ${data.startTime}. Onaylaninca bilgi verilecek.`
    case 'confirmed':
      return `Randevunuz onaylandi: ${data.typeName}, ${d} ${data.startTime}.`
    case 'reminder':
      return `Hatirlatma: yarin randevunuz var. ${data.typeName}, ${d} ${data.startTime}.`
    case 'rescheduled':
      return `Randevunuz guncellendi: ${data.typeName}, ${d} ${data.startTime}.`
    case 'cancelled':
      return `Randevunuz iptal edildi: ${data.typeName}, ${d} ${data.startTime}.`
    case 'admin_new':
      return `Yeni randevu talebi: ${data.clientName}, ${d} ${data.startTime}.`
  }
}
