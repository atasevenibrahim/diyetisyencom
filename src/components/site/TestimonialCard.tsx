import { Star } from 'lucide-react'

import type { Testimonial } from '@/payload-types'
import { cn } from '@/lib/utils'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} / 5 puan`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('size-4', i < rating ? 'fill-apricot text-apricot' : 'text-sage-200')}
        />
      ))}
    </div>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const display = testimonial.initials || testimonial.name
  return (
    <figure className="border-sage-200 flex h-full flex-col gap-4 rounded-2xl border bg-card p-6">
      <Stars rating={testimonial.rating} />
      <blockquote className="text-ink flex-1 text-sm leading-relaxed">
        “{testimonial.text}”
      </blockquote>
      <figcaption className="flex items-center justify-between gap-2">
        <span className="text-sage-900 text-sm font-semibold">{display}</span>
        {testimonial.source && testimonial.source !== 'Direct' ? (
          <span className="text-muted-foreground text-xs">{testimonial.source}</span>
        ) : null}
      </figcaption>
    </figure>
  )
}
