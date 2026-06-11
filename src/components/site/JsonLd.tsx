export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // İçerik güvenilir (kendi verimiz); JSON.stringify XSS riskini sınırlar.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
