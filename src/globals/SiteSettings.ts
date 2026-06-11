import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Ayarları',
  admin: { group: 'Ayarlar' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'İletişim',
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Telefon',
              defaultValue: '0850 474 10 56',
            },
            { name: 'whatsapp', type: 'text', label: 'WhatsApp Numarası' },
            { name: 'email', type: 'email', label: 'E-posta' },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram Kullanıcı Adı',
              defaultValue: '@uzm.dyt.ozdenozgurdurukan',
            },
            { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
            {
              name: 'address',
              type: 'textarea',
              label: 'Adres',
              defaultValue: 'Emek Mah. Bişkek Cad. 195/5, Çankaya/Ankara',
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              label: 'Google Harita Embed URL',
            },
            {
              name: 'workingHours',
              type: 'text',
              label: 'Çalışma Saatleri',
              defaultValue: 'Her gün 09:00–19:00',
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Anasayfa Hero',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Başlık',
                  defaultValue: 'Uzm. Dyt. Özden Özgür Durukan',
                },
                {
                  name: 'subheading',
                  type: 'textarea',
                  label: 'Alt Başlık',
                  defaultValue:
                    'Ankara/Çankaya’da kişiye özel, bilim temelli beslenme ve diyet danışmanlığı. Yanınızdaki uzmanla sürdürülebilir bir yolculuk.',
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  label: 'CTA Metni',
                  defaultValue: 'Online randevu al',
                },
                {
                  name: 'ctaHref',
                  type: 'text',
                  label: 'CTA Bağlantısı',
                  defaultValue: '/randevu',
                },
                {
                  name: 'portrait',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Portre Görseli',
                },
              ],
            },
          ],
        },
        {
          label: 'Güven',
          fields: [
            {
              name: 'trustStats',
              type: 'array',
              label: 'Güven İstatistikleri',
              labels: { singular: 'İstatistik', plural: 'İstatistikler' },
              admin: { description: 'Hero güven şeridi (ör. "18 yıl" / "deneyim").' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', required: true, label: 'Değer' },
                    { name: 'label', type: 'text', required: true, label: 'Etiket' },
                  ],
                },
              ],
            },
            {
              name: 'reviewBadges',
              type: 'array',
              label: 'Yorum Rozetleri',
              labels: { singular: 'Rozet', plural: 'Rozetler' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'source',
                      type: 'select',
                      label: 'Kaynak',
                      options: [
                        { label: 'Google', value: 'Google' },
                        { label: 'Doktorsitesi', value: 'Doktorsitesi' },
                      ],
                    },
                    { name: 'rating', type: 'text', label: 'Puan', defaultValue: '5.0' },
                  ],
                },
                { name: 'url', type: 'text', label: 'Dış Bağlantı' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
