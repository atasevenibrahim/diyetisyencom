import type { CollectionConfig } from 'payload'

// Tarih bazlı istisnalar: tatil/izin (closed) veya özel saat (custom).
export const ScheduleExceptions: CollectionConfig = {
  slug: 'schedule-exceptions',
  labels: { singular: 'İstisna Gün', plural: 'İstisna Günler' },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'type', 'note'],
    group: 'Randevular',
  },
  access: { read: () => true },
  defaultSort: 'date',
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      label: 'Tarih (YYYY-AA-GG)',
      admin: { description: 'Örn. 2026-07-15' },
      validate: (value: unknown) =>
        typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? true
          : 'Tarih YYYY-AA-GG biçiminde olmalı.',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'closed',
      label: 'Tür',
      options: [
        { label: 'Kapalı (tatil/izin)', value: 'closed' },
        { label: 'Özel saat', value: 'custom' },
      ],
    },
    {
      name: 'start',
      type: 'text',
      label: 'Başlangıç (SS:DD)',
      admin: { condition: (data) => data?.type === 'custom', description: 'Örn. 10:00' },
    },
    {
      name: 'end',
      type: 'text',
      label: 'Bitiş (SS:DD)',
      admin: { condition: (data) => data?.type === 'custom', description: 'Örn. 14:00' },
    },
    { name: 'note', type: 'text', label: 'Not' },
  ],
}
