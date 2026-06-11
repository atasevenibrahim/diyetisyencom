import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Devices: CollectionConfig = {
  slug: 'devices',
  labels: { singular: 'Cihaz', plural: 'Cihazlar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tagline', 'order'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Cihaz Adı' },
    slugField('name'),
    { name: 'tagline', type: 'text', label: 'Kısa Slogan' },
    { name: 'description', type: 'richText', label: 'Açıklama' },
    {
      name: 'benefits',
      type: 'array',
      label: 'Faydalar',
      labels: { singular: 'Fayda', plural: 'Faydalar' },
      fields: [{ name: 'benefit', type: 'text', required: true }],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Görsel',
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
