import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import type { Device } from '@/payload-types'

export function DeviceCard({ device }: { device: Device }) {
  const benefits = (device.benefits ?? []).slice(0, 3)
  return (
    <Link
      href={`/cihazlar/${device.slug}`}
      className="group border-sage-200 hover:border-sage-500 flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="from-sage-200 to-sage-50 flex aspect-[16/10] items-center justify-center bg-gradient-to-br">
        <span className="bg-card/70 text-sage-700 flex size-14 items-center justify-center rounded-full">
          <Sparkles className="size-7" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-sage-900 text-lg font-semibold">{device.name}</h3>
        {device.tagline ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{device.tagline}</p>
        ) : null}
        {benefits.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {benefits.map((b, i) => (
              <li
                key={i}
                className="bg-sage-50 text-sage-700 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {b.benefit}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="text-sage-700 mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium">
          Detaylar
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
