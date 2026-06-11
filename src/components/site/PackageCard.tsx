import Link from 'next/link'
import { Check, Users } from 'lucide-react'

import type { Package } from '@/payload-types'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'

export function PackageCard({ pkg, featured = false }: { pkg: Package; featured?: boolean }) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:p-7',
        featured ? 'border-sage-700 shadow-md ring-1 ring-sage-700' : 'border-sage-200',
      )}
    >
      {featured ? (
        <span className="bg-sage-700 text-primary-foreground absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold">
          En çok tercih edilen
        </span>
      ) : null}

      <div className="flex flex-col gap-2">
        <h3 className="text-sage-900 text-lg font-semibold">{pkg.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{pkg.summary}</p>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-sage-900 text-3xl font-semibold">{formatPrice(pkg.price)}</span>
        {pkg.oldPrice ? (
          <span className="text-muted-foreground mb-1 text-sm line-through">
            {formatPrice(pkg.oldPrice)}
          </span>
        ) : null}
      </div>

      {pkg.features && pkg.features.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {pkg.features.map((f, i) => (
            <li key={i} className="text-ink flex items-start gap-2 text-sm">
              <Check className="text-sage-700 mt-0.5 size-4 shrink-0" />
              {f.feature}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-col gap-3">
        {pkg.familyDiscount ? (
          <p className="text-sage-700 flex items-center gap-1.5 text-xs font-medium">
            <Users className="size-3.5" />
            Aile paketinde %10 indirim
          </p>
        ) : null}
        {pkg.note ? <p className="text-muted-foreground text-xs">{pkg.note}</p> : null}
        <Button asChild variant={featured ? 'accent' : 'outline'}>
          <Link href="/randevu">Randevu al</Link>
        </Button>
      </div>
    </div>
  )
}
