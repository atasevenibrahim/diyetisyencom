import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Yorum', plural: 'Yorumlar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'source', 'consent'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: '-date',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'İsim' },
    {
      name: 'initials',
      type: 'text',
      label: 'Baş Harfler',
      admin: { description: 'Gizlilik için tam isim yerine gösterilebilir (ör. A.Y.).' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      label: 'Puan',
    },
    { name: 'text', type: 'textarea', required: true, label: 'Yorum' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'Direct',
      label: 'Kaynak',
      options: [
        { label: 'Google', value: 'Google' },
        { label: 'Doktorsitesi', value: 'Doktorsitesi' },
        { label: 'Doğrudan', value: 'Direct' },
      ],
    },
    { name: 'service', type: 'text', label: 'İlgili Hizmet' },
    {
      name: 'date',
      type: 'date',
      label: 'Tarih',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'consent',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      label: 'Yayın Rızası Var',
      admin: { description: 'KVKK: yalnızca rıza alınan yorumlar yayınlanır.' },
    },
  ],
}
