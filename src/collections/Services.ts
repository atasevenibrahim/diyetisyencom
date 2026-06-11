import type { CollectionConfig } from 'payload'

import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Hizmet', plural: 'Hizmetler' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    slugField('title'),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      label: 'Özet',
      admin: { description: 'Grid kartında görünen kısa açıklama.' },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'İkon',
      admin: { description: 'lucide ikon adı (ör. heart-pulse, salad, baby).' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Kilo Yönetimi', value: 'kilo-yonetimi' },
        { label: 'İnsulin Direnci & Diyabet', value: 'insulin-direnci-diyabet' },
        { label: 'PCOS', value: 'pcos' },
        { label: 'Haşimoto', value: 'hasimoto' },
        { label: 'Gebelik & Emzirme', value: 'gebelik-emzirme' },
        { label: 'GLP-1 Sürecinde Beslenme', value: 'glp1' },
        { label: 'Bölgesel & Vücut Şekillendirme', value: 'bolgesel' },
        { label: 'Detoks & Sürdürülebilir Beslenme', value: 'surdurulebilir' },
        { label: 'Online & Yüz Yüze Danışmanlık', value: 'danismanlik' },
        { label: 'Diğer', value: 'diger' },
      ],
    },
    { name: 'body', type: 'richText', label: 'İçerik' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sıra',
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
