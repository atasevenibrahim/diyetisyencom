import type { CollectionConfig } from 'payload'

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// İletişim formu kayıtları. Herkes oluşturabilir (form), yalnızca admin görür.
// E-posta bildirimi Faz 3'te eklenecek.
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'İletişim Mesajı', plural: 'İletişim Mesajları' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'Gelen',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad Soyad' },
    { name: 'phone', type: 'text', label: 'Telefon' },
    { name: 'email', type: 'email', label: 'E-posta' },
    { name: 'subject', type: 'text', label: 'Konu' },
    { name: 'message', type: 'textarea', required: true, label: 'Mesaj' },
  ],
  timestamps: true,
}
