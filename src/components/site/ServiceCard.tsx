import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Service } from '@/payload-types'
import { ServiceIcon } from './Icon'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="group border-sage-200 hover:border-sage-500 flex flex-col gap-4 rounded-2xl border bg-card p-6 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="bg-sage-50 text-sage-700 flex size-12 items-center justify-center rounded-xl transition-colors group-hover:bg-sage-700 group-hover:text-primary-foreground">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>
      <h3 className="text-sage-900 text-lg font-semibold">{service.title}</h3>
      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{service.summary}</p>
      <span className="text-sage-700 inline-flex items-center gap-1 text-sm font-medium">
        Detaylar
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
