import { ImageResponse } from 'next/og'

import { ogLogo } from './og-logo-data'

export const runtime = 'nodejs'
export const alt = 'Uzm. Dyt. Özden Özgür Durukan — Beslenme ve Diyet Danışmanlığı'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Markalı sosyal paylaşım görseli (og:image). Logo base64 modülünden gömülü gelir.
export default async function OpengraphImage() {
  const logoSrc = ogLogo

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f4ed',
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={200} height={200} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 58,
            fontWeight: 700,
            color: '#2c3a31',
            textAlign: 'center',
          }}
        >
          Uzm. Dyt. Özden Özgür Durukan
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: '#4f6b58', textAlign: 'center' }}>
          Ankara · Kişiye özel, bilim temelli beslenme ve diyet danışmanlığı
        </div>
      </div>
    ),
    { ...size },
  )
}
