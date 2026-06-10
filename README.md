# Uzm. Dyt. Özden Özgür Durukan — Web Sitesi

Ankara/Çankaya'da çalışan uzman diyetisyen için markalı, mobil öncelikli, online
randevulu web sitesi. **Next.js (App Router) + Payload CMS 3 + PostgreSQL**.

Tek doğruluk kaynağı: [OZDEN_DURUKAN_MASTER_BRIEF.md](./OZDEN_DURUKAN_MASTER_BRIEF.md).

## Teknoloji

- **Next.js 16** (App Router, RSC) + **TypeScript** (strict)
- **Payload CMS 3** — Next.js içine gömülü admin paneli (`/admin`)
- **PostgreSQL** — `@payloadcms/db-vercel-postgres` (yerelde Docker, üretimde Vercel Postgres)
- **Tailwind CSS v4** + **shadcn/ui** (yalnızca `(frontend)` route grubunda; admin paneli izole)
- **Vercel** (hedef barındırma)

## Kurulum

```bash
pnpm install
cp .env.example .env        # POSTGRES_URL ve PAYLOAD_SECRET doldur

# Yerel Postgres (Docker gerekir):
docker compose up -d

pnpm dev                    # http://localhost:3000  ·  /admin
```

İlk `/admin` ziyaretinde admin kullanıcısı oluşturulur. Şema, dev modunda
koleksiyon tanımlarına göre otomatik senkronlanır.

## Komutlar

| Komut | Açıklama |
|---|---|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Üretim derlemesi |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript denetimi |
| `pnpm format` | Prettier (Tailwind sınıf sıralama dahil) |
| `pnpm generate:types` | Payload tiplerini üret (`src/payload-types.ts`) |

## Tasarım sistemi

"Sıcak & Doğal" — adaçayı yeşili (birincil) + kayısı (tek sıcak vurgu). Renk
token'ları [globals.css](<./src/app/(frontend)/globals.css>) içinde CSS değişkenleri
olarak tanımlı; Tailwind utility'leri bunlara bağlıdır. Sihirli renk sabiti kullanma.

## MCP

`.mcp.json` üç sunucu tanımlar: shadcn, chrome-devtools, magic (21st.dev). Magic için
`TWENTYFIRST_API_KEY` ortam değişkenini ayarla. `/mcp` ile bağlılığı doğrula.

## Yol haritası

Faz 0 (bu commit): temel kurulum. Faz 1+: içerik sayfaları, randevu sistemi,
bildirimler, KVKK. Bkz. Master Brief Bölüm 12.
