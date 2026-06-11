export const blogCategoryLabels: Record<string, string> = {
  beslenme: 'Beslenme',
  'kilo-yonetimi': 'Kilo Yönetimi',
  hastaliklar: 'Hastalıklar & Beslenme',
  'gebelik-cocuk': 'Gebelik & Çocuk',
  tarifler: 'Tarifler',
  yasam: 'Yaşam',
}

export const blogCategoryLabel = (value?: string | null): string =>
  (value && blogCategoryLabels[value]) || 'Genel'
