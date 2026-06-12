// WhatsApp (Meta Cloud API) — STUB. İşletme doğrulaması + onaylı şablon gerektiği için
// gerçek gönderim sonraya bırakıldı. Arayüz hazır; token gelince doldurulacak.
export const whatsappEnabled = (): boolean =>
  Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)

export async function sendWhatsapp(opts: { to: string; text: string }): Promise<void> {
  if (!whatsappEnabled()) {
    console.info('[notify] whatsapp atlandı (stub / env yok)')
    return
  }
  // TODO (Faz 3+): Meta Cloud API onaylı şablonla gönderim.
  console.info('[notify] whatsapp gönderimi (stub):', opts.to)
}
