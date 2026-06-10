import Link from 'next/link'
import { ArrowRight, CalendarHeart, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Faz 0 yer tutucu anasayfa: tasarim token'larini ve shadcn Button'u dogrular.
// Gercek anasayfa (hero + guven seridi + surec + yorumlar) Faz 1'de gelir.
export default function HomePage() {
  return (
    <main className="bg-background min-h-dvh">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center">
        <span className="bg-sage-50 text-sage-700 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <Star className="fill-apricot text-apricot size-4" />
          18 yıl deneyim · 5.0 ★ · Hacettepe uzmanlık
        </span>

        <h1 className="text-sage-900 text-4xl font-semibold tracking-tight sm:text-5xl">
          Uzm. Dyt. Özden Özgür Durukan
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg">
          Ankara/Çankaya&apos;da kişiye özel, bilim temelli beslenme ve diyet danışmanlığı.
          Yanınızdaki uzmanla sürdürülebilir bir yolculuk.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/randevu">
              <CalendarHeart />
              Online randevu al
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin">
              Yönetim paneli
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground text-sm">
          Faz 0 — temel kurulum. İçerik sayfaları Faz 1&apos;de gelecek.
        </p>
      </section>
    </main>
  )
}
