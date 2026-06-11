import type { GlobalConfig } from 'payload'

const days = [
  { label: 'Pazartesi', value: 'mon' },
  { label: 'Salı', value: 'tue' },
  { label: 'Çarşamba', value: 'wed' },
  { label: 'Perşembe', value: 'thu' },
  { label: 'Cuma', value: 'fri' },
  { label: 'Cumartesi', value: 'sat' },
  { label: 'Pazar', value: 'sun' },
]

export const Availability: GlobalConfig = {
  slug: 'availability',
  label: 'Müsaitlik',
  admin: { group: 'Randevular' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Haftalık Saatler',
          fields: [
            {
              name: 'weekly',
              type: 'array',
              label: 'Haftalık Çalışma Saatleri',
              labels: { singular: 'Gün', plural: 'Günler' },
              admin: {
                description: 'Her gün için açık/kapalı ve saat aralığı.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      type: 'select',
                      required: true,
                      label: 'Gün',
                      options: days,
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Açık',
                    },
                    { name: 'start', type: 'text', label: 'Başlangıç (SS:DD)', defaultValue: '09:00' },
                    { name: 'end', type: 'text', label: 'Bitiş (SS:DD)', defaultValue: '19:00' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Kurallar',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'slotIntervalMin',
                  type: 'number',
                  defaultValue: 30,
                  label: 'Slot Aralığı (dk)',
                },
                { name: 'bufferMin', type: 'number', defaultValue: 0, label: 'Randevular Arası Tampon (dk)' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minLeadHours',
                  type: 'number',
                  defaultValue: 3,
                  label: 'Min. Ön Süre (saat)',
                },
                {
                  name: 'maxAdvanceDays',
                  type: 'number',
                  defaultValue: 60,
                  label: 'Maks. İleri Tarih (gün)',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lateToleranceMin',
                  type: 'number',
                  defaultValue: 5,
                  label: 'Gecikme Toleransı (dk)',
                },
                {
                  name: 'rescheduleStandardDays',
                  type: 'number',
                  defaultValue: 7,
                  label: 'Erteleme — Standart (gün)',
                },
                {
                  name: 'rescheduleQuarterlyDays',
                  type: 'number',
                  defaultValue: 14,
                  label: 'Erteleme — 3 Aylık (gün)',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
