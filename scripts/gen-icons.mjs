// public/logo.png'den favicon/app-icon/OG logosu üretir.
// Çalıştır: node scripts/gen-icons.mjs
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const SRC = 'public/logo.png'
const SAND = { r: 247, g: 244, b: 237, alpha: 1 } // #f7f4ed
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

if (!existsSync(SRC)) {
  console.error(`HATA: ${SRC} bulunamadı. Önce logoyu buraya kaydet.`)
  process.exit(1)
}

const contain = (size, bg) =>
  sharp(SRC).resize(size, size, { fit: 'contain', background: bg })

// favicon (şeffaf) + apple-icon (sand zemin, iOS karesinde siyah görünmesin)
await contain(512, TRANSPARENT).png().toFile('src/app/icon.png')
await contain(180, SAND).flatten({ background: '#f7f4ed' }).png().toFile('src/app/apple-icon.png')

// favicon.ico (16/32/48) → /favicon.ico 404'ünü kapatır
const sizes = [16, 32, 48]
const bufs = await Promise.all(sizes.map((s) => contain(s, TRANSPARENT).png().toBuffer()))
writeFileSync('src/app/favicon.ico', await pngToIco(bufs))

// OG görseli için logoyu base64 modülü olarak göm (Turbopack build'de fetch(file://) yok).
const ogDir = 'src/app/(frontend)'
if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true })
const ogBuf = await contain(420, TRANSPARENT).png().toBuffer()
writeFileSync(
  `${ogDir}/og-logo-data.ts`,
  `// Otomatik üretildi: scripts/gen-icons.mjs. Elle düzenleme.\n` +
    `export const ogLogo = 'data:image/png;base64,${ogBuf.toString('base64')}'\n`,
)

console.log('✓ icon.png, apple-icon.png, favicon.ico, og-logo-data.ts üretildi')
