import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: { singular: 'Paket', plural: 'Paketler' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'order'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Paket Adı' },
    slugField('name'),
    { name: 'summary', type: 'textarea', required: true, label: 'Özet' },
    {
      type: 'row',
      fields: [
        { name: 'sessions', type: 'number', label: 'Görüşme Sayısı' },
        { name: 'durationWeeks', type: 'number', label: 'Süre (hafta)' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', required: true, label: 'Fiyat (TL)' },
        {
          name: 'oldPrice',
          type: 'number',
          label: 'Eski Fiyat (TL)',
          admin: { description: 'İndirim varsa üstü çizili gösterilir.' },
        },
      ],
    },
    { name: 'discountNote', type: 'text', label: 'İndirim Notu' },
    {
      name: 'features',
      type: 'array',
      label: 'Özellikler',
      labels: { singular: 'Özellik', plural: 'Özellikler' },
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    {
      name: 'familyDiscount',
      type: 'checkbox',
      defaultValue: false,
      label: 'Aile İndirimine Uygun (%10)',
    },
    {
      name: 'note',
      type: 'text',
      label: 'Ek Not',
      admin: { description: 'Ör. "İlk geldiğiniz görüşmede ücret alınmaktadır."' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sıra',
      admin: { position: 'sidebar' },
    },
  ],
}
