// Telefonu Türkiye formatına indirger (başında 90, 12 hane). Boşsa null.
export function normalizePhoneTR(raw?: string | null): string | null {
  if (!raw) return null
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  if (d.length === 10) d = '90' + d
  if (d.startsWith('90') && d.length === 12) return d
  return d.length >= 10 ? d : null
}

export const smsEnabled = (): boolean =>
  Boolean(process.env.NETGSM_USERNAME && process.env.NETGSM_PASSWORD)

// NetGSM HTTP API (config-gated). Kullanıcı NetGSM kullanıcı/şifre + onaylı başlık verince aktif.
export async function sendSms(opts: { to: string; text: string; header?: string | null }): Promise<void> {
  if (!smsEnabled()) {
    console.info('[notify] sms atlandı (NetGSM env yok)')
    return
  }
  const gsmno = normalizePhoneTR(opts.to)
  if (!gsmno) {
    console.info('[notify] sms atlandı (geçersiz telefon)')
    return
  }
  const params = new URLSearchParams({
    usercode: process.env.NETGSM_USERNAME as string,
    password: process.env.NETGSM_PASSWORD as string,
    gsmno,
    message: opts.text,
    msgheader: opts.header || process.env.NETGSM_HEADER || '',
  })
  const res = await fetch(`https://api.netgsm.com.tr/sms/send/get?${params.toString()}`)
  const body = (await res.text()).trim()
  // NetGSM başarıda "00 <jobid>" veya "01"/"02" döner; diğerleri hata kodu.
  const code = body.split(/\s+/)[0]
  if (!['00', '01', '02'].includes(code)) {
    throw new Error(`NetGSM hata kodu: ${body}`)
  }
}
