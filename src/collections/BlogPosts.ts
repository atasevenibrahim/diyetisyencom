import type { CollectionConfig } from 'payload'

import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: { singular: 'Blog Yazısı', plural: 'Blog Yazıları' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
    group: 'İçerik',
  },
  access: { read: () => true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    slugField('title'),
    { name: 'excerpt', type: 'textarea', label: 'Özet' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Kapak Görseli' },
    { name: 'body', type: 'richText', label: 'İçerik' },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      options: [
        { label: 'Beslenme', value: 'beslenme' },
        { label: 'Kilo Yönetimi', value: 'kilo-yonetimi' },
        { label: 'Hastalıklar & Beslenme', value: 'hastaliklar' },
        { label: 'Gebelik & Çocuk', value: 'gebelik-cocuk' },
        { label: 'Tarifler', value: 'tarifler' },
        { label: 'Yaşam', value: 'yasam' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Yayın Tarihi',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      defaultValue: () => new Date(),
    },
    seoField,
  ],
}
