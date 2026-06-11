'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { navLinks } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import { Container } from './Container'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-sand/85 border-sage-200/70 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="bg-sage-700 flex size-9 items-center justify-center rounded-full text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sage-900 text-base font-semibold">
              Özden Özgür Durukan
            </span>
            <span className="text-muted-foreground text-[11px] tracking-wide">
              Uzman Diyetisyen
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-sage-900 bg-sage-50'
                    : 'text-muted-foreground hover:text-sage-900 hover:bg-sage-50',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="accent">
            <Link href="/randevu">Randevu al</Link>
          </Button>
        </div>

        <button
          type="button"
          className="text-sage-900 hover:bg-sage-50 inline-flex size-10 items-center justify-center rounded-md lg:hidden"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {open ? (
        <div className="border-sage-200/70 bg-sand border-t lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sage-900 hover:bg-sage-50 rounded-md px-3 py-2.5 text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="accent" className="mt-2">
              <Link href="/randevu" onClick={() => setOpen(false)}>
                Randevu al
              </Link>
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
