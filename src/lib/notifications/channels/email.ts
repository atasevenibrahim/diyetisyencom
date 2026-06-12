import { Resend } from 'resend'

export const emailEnabled = (): boolean => Boolean(process.env.RESEND_API_KEY)

export async function sendEmail(opts: {
  to: string
  from: string
  subject: string
  html: string
}): Promise<void> {
  if (!emailEnabled()) {
    console.info('[notify] email atlandı (RESEND_API_KEY yok)')
    return
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
}
