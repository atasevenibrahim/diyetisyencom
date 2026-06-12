import type { CollectionConfig } from 'payload'

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// Slotu işgal eden (aktif) statüler. Bunlar dışındakiler slotu serbest bırakır.
const ACTIVE_STATUSES = ['pending', 'confirmed', 'completed']

// Randevular. Booking akışı public create eder (status pending). Yönetim admin'de.
// date "YYYY-MM-DD" ve startTime "HH:mm" metin olarak tutulur (TZ kayması olmasın diye).
export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: { singular: 'Randevu', plural: 'Randevular' },
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['date', 'startTime', 'clientName', 'status', 'appointmentType'],
    group: 'Randevular',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-date',
  hooks: {
    // Çift rezervasyon kilidi: aktif randevular için slotKey = "date T startTime",
    // pasif (iptal/ertelendi/gelmedi) için null. slotKey alanı unique olduğundan
    // (Postgres çoklu NULL'a izin verir) aynı slota ikinci aktif kayıt DB'de reddedilir.
    // Ayrıca self-servis için cancelToken (oluşturmada) üretilir.
    beforeChange: [
      ({ data, operation }) => {
        const active = ACTIVE_STATUSES.includes(data.status as string)
        data.slotKey = active && data.date && data.startTime ? `${data.date}T${data.startTime}` : null
        if (operation === 'create' && !data.cancelToken) {
          data.cancelToken = globalThis.crypto.randomUUID()
        }
        return data
      },
    ],
    // Bildirim olaylarını tetikle (e-posta/SMS). Hatalar randevu kaydını etkilemez.
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        try {
          const { notifyAppointmentChange } = await import('@/lib/notifications/appointments')
          await notifyAppointmentChange({ payload: req.payload, doc, previousDoc, operation })
        } catch (e) {
          req.payload.logger.error({ msg: '[notify] afterChange hatası', err: e })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'slotKey',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    {
      name: 'cancelToken',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'text',
          required: true,
          label: 'Tarih (YYYY-AA-GG)',
          validate: (value: unknown) =>
            typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
              ? true
              : 'Tarih YYYY-AA-GG biçiminde olmalı.',
        },
        {
          name: 'startTime',
          type: 'text',
          required: true,
          label: 'Saat (SS:DD)',
          validate: (value: unknown) =>
            typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)
              ? true
              : 'Saat SS:DD biçiminde olmalı.',
        },
        { name: 'durationMin', type: 'number', required: true, label: 'Süre (dk)' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Durum',
      options: [
        { label: 'Beklemede', value: 'pending' },
        { label: 'Onaylandı', value: 'confirmed' },
        { label: 'İptal edildi', value: 'cancelled' },
        { label: 'Ertelendi', value: 'rescheduled' },
        { label: 'Tamamlandı', value: 'completed' },
        { label: 'Gelmedi', value: 'no_show' },
      ],
    },
    {
      name: 'appointmentType',
      type: 'relationship',
      relationTo: 'appointment-types',
      required: true,
      label: 'Görüşme Türü',
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      defaultValue: 'in_person',
      label: 'Kanal',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Yüz yüze', value: 'in_person' },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'İlgili Hizmet (opsiyonel)',
    },
    {
      type: 'row',
      fields: [
        { name: 'clientName', type: 'text', required: true, label: 'Ad Soyad' },
        { name: 'phone', type: 'text', required: true, label: 'Telefon' },
        { name: 'email', type: 'email', label: 'E-posta' },
      ],
    },
    { name: 'notes', type: 'textarea', label: 'Notlar' },
    {
      name: 'kvkkConsent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      label: 'KVKK Açık Rıza',
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Hatırlatma Gönderildi',
      admin: { position: 'sidebar', description: 'Faz 3 (otomatik).' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'none',
      label: 'Ödeme Durumu',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Yok', value: 'none' },
        { label: 'Beklemede', value: 'pending' },
        { label: 'Ödendi', value: 'paid' },
        { label: 'İade', value: 'refunded' },
      ],
    },
    {
      name: 'paymentProvider',
      type: 'text',
      label: 'Ödeme Sağlayıcı',
      admin: { position: 'sidebar', description: 'Faz 6.' },
    },
  ],
  timestamps: true,
}
