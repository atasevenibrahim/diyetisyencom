import Link from 'next/link'
import { CalendarHeart, Leaf, Star } from 'lucide-react'

import { getSiteSettings } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Button } from '@/components/ui/button'

export async function Hero() {
  const s = await getSiteSettings()
  const hero = s.hero
  const stats = s.trustStats ?? []
  const badges = s.reviewBadges ?? []

  return (
    <section className="relative overflow-hidden">
      {/* yumuşak organik zemin */}
      <div
        aria-hidden="true"
        className="bg-sage-50/60 pointer-events-none absolute -top-24 -right-24 size-[28rem] rounded-full blur-3xl"
      />
      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          {badges.length > 0 ? (
            <span className="border-sage-200 bg-card text-sage-700 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
              <Star className="fill-apricot text-apricot size-4" />
              {badges.map((b) => `${b.source} ${b.rating}`).join(' · ')}
            </span>
          ) : null}

          <h1 className="text-sage-900 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {hero?.heading ?? 'Uzm. Dyt. Özden Özgür Durukan'}
          </h1>

          <p className="text-muted-foreground max-w-xl text-lg text-pretty">
            {hero?.subheading}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href={hero?.ctaHref ?? '/randevu'}>
                <CalendarHeart />
                {hero?.ctaLabel ?? 'Online randevu al'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/hizmetler">Hizmetleri keşfet</Link>
            </Button>
          </div>

          {stats.length > 0 ? (
            <dl className="border-sage-200 mt-2 grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <dt className="text-sage-900 text-xl font-semibold">{stat.value}</dt>
                  <dd className="text-muted-foreground text-xs">{stat.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* portre placeholder (gerçek görsel Faz 1 sonrası) */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="from-sage-200 to-sage-50 ring-sage-200 flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-gradient-to-br ring-1">
            <div className="flex flex-col items-center gap-3">
              <span className="bg-sage-700 text-primary-foreground flex size-20 items-center justify-center rounded-full">
                <Leaf className="size-9" />
              </span>
              <span className="font-display text-sage-700/70 text-2xl font-semibold">
                ÖÖD
              </span>
            </div>
          </div>
          <div className="border-sage-200 bg-card absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2 shadow-sm">
            <Star className="fill-apricot text-apricot size-4" />
            <span className="text-sage-900 text-sm font-medium">5.0 puan · {stats[0]?.value ?? '18 yıl'} deneyim</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
