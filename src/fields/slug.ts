import type { Field } from 'payload'

const trMap: Record<string, string> = {
  ı: 'i',
  i̇: 'i',
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ö: 'o',
  ç: 'c',
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[ıi̇ğüşöç]/g, (c) => trMap[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// TR-duyarli slug alani: bos birakilirsa `from` alanindan uretilir.
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL parcasi. Bos birakilirsa baslitan otomatik uretilir.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return slugify(String(value))
        const source = data?.[from]
        return source ? slugify(String(source)) : value
      },
    ],
  },
})
