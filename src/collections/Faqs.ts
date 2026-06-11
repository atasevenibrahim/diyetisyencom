import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'SSS', plural: 'Sık Sorulan Sorular' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Soru' },
    { name: 'answer', type: 'richText', required: true, label: 'Cevap' },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Genel', value: 'genel' },
        { label: 'Randevu & Süreç', value: 'randevu' },
        { label: 'Paketler & Ücret', value: 'paketler' },
        { label: 'Online Danışmanlık', value: 'online' },
        { label: 'Cihazlar', value: 'cihazlar' },
      ],
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
