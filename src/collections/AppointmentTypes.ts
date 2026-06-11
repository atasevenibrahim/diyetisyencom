import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const AppointmentTypes: CollectionConfig = {
  slug: 'appointment-types',
  labels: { singular: 'Görüşme Türü', plural: 'Görüşme Türleri' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'durationMin', 'channel', 'order'],
    group: 'Randevular',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad' },
    slugField('name'),
    {
      name: 'durationMin',
      type: 'number',
      required: true,
      label: 'Süre (dakika)',
      defaultValue: 30,
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      defaultValue: 'both',
      label: 'Kanal',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Yüz yüze', value: 'in_person' },
        { label: 'Her ikisi', value: 'both' },
      ],
    },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
      admin: { position: 'sidebar' },
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
