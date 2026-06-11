import type { Field } from 'payload'

// Tekrar kullanilabilir SEO alan grubu. Bos alanlar sayfa varsayilanlarina duser.
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Bos birakilirsa sayfa/kayit basligi kullanilir.' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Arama sonucu/OG aciklamasi (~155 karakter).' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'OG paylasim gorseli (1200x630 onerilir).' },
    },
  ],
}
