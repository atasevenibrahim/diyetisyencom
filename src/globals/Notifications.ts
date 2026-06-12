import type { GlobalConfig } from 'payload'

const eventOptions = [
  { label: 'Talep alındı (danışan)', value: 'requested' },
  { label: 'Onaylandı', value: 'confirmed' },
  { label: 'İptal edildi', value: 'cancelled' },
  { label: 'Ertelendi', value: 'rescheduled' },
  { label: '24 saat hatırlatma', value: 'reminder' },
  { label: 'Yeni talep (diyetisyen)', value: 'admin_new' },
]

export const Notifications: GlobalConfig = {
  slug: 'notifications',
  label: 'Bildirimler',
  admin: { group: 'Ayarlar' },
  // Sadece admin (gizli ayar); public read yok.
  fields: [
    {
      type: 'collapsible',
      label: 'Gönderici',
      fields: [
        {
          name: 'senderName',
          type: 'text',
          label: 'Gönderen Adı',
          defaultValue: 'Uzm. Dyt. Özden Özgür Durukan',
        },
        {
          name: 'senderEmail',
          type: 'text',
          label: 'Gönderen E-posta (Resend doğrulanmış domain)',
          defaultValue: 'randevu@ozdenozgurdurukan.com',
        },
        {
          name: 'adminEmail',
          type: 'email',
          label: 'Yeni Talep Bildirimi E-postası (diyetisyen)',
          admin: { description: 'Boşsa site iletişim e-postası kullanılır.' },
        },
        {
          name: 'smsHeader',
          type: 'text',
          label: 'SMS Başlığı (NetGSM onaylı)',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Kanal × Olay (aç/kapa)',
      fields: [
        {
          name: 'emailEvents',
          type: 'select',
          hasMany: true,
          label: 'E-posta gönderilecek olaylar',
          defaultValue: ['requested', 'confirmed', 'cancelled', 'rescheduled', 'reminder', 'admin_new'],
          options: eventOptions,
        },
        {
          name: 'smsEvents',
          type: 'select',
          hasMany: true,
          label: 'SMS gönderilecek olaylar (NetGSM gerekir)',
          defaultValue: [],
          options: eventOptions,
        },
        {
          name: 'whatsappEvents',
          type: 'select',
          hasMany: true,
          label: 'WhatsApp gönderilecek olaylar (sonra)',
          defaultValue: [],
          options: eventOptions,
        },
      ],
    },
  ],
}
