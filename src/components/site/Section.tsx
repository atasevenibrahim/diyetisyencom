import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Section({
  id,
  className,
  children,
  muted = false,
}: {
  id?: string
  className?: string
  children: ReactNode
  muted?: boolean
}) {
  return (
    <section
      id={id}
      className={cn('py-16 sm:py-20 lg:py-24', muted && 'bg-sage-50', className)}
    >
      {children}
    </section>
  )
}
