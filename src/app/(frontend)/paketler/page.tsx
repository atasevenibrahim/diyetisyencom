import type { Metadata } from 'next'
import { Info, Users } from 'lucide-react'

import { getPackages } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { PackageCard } from '@/components/site/PackageCard'
import { CtaBand } from '@/components/site/CtaBand'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Paketler & Fiyatlar',
  description:
    'Şeffaf fiyatlarla beslenme ve diyet takip paketleri. Aylık ve sıkı takip seçenekleri, aile paketinde %10 indirim.',
}

export default async function PaketlerPage() {
  const packages = await getPackages()
  return (
    <>
      <PageHeader
        eyebrow="Paketler"
        title="Şeffaf fiyatlar, net içerikler"
        description="Hedeflerine uygun paketi seç; ilk görüşmeden itibaren yanındayız."
      />

      <Section>
        <Container className="flex flex-col gap-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                featured={pkg.slug === 'aylik-beslenme-diyet-takipli'}
              />
            ))}
          </div>

          <div className="border-sage-200 bg-sage-50 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:gap-6">
            <span className="bg-sage-700 text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Users className="size-6" />
            </span>
            <div>
              <h3 className="text-sage-900 font-semibold">Aile Paketleri</h3>
              <p className="text-muted-foreground text-sm">
                Siz ve en az bir aile bireyi, seçtiğiniz pakette <strong>%10 indirimli</strong>{' '}
                yararlanır.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground flex items-start gap-2 text-sm">
            <Info className="text-sage-500 mt-0.5 size-4 shrink-0" />
            İlk geldiğiniz görüşmede ücret alınmaktadır. Fiyatlar bilgilendirme amaçlıdır; güncel
            koşullar için bizimle iletişime geçebilirsiniz.
          </p>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
