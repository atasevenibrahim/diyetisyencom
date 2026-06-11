import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

import { getFaqs, getPackages, getServices, getSiteSettings, getTestimonials } from '@/lib/payload'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { ServiceCard } from '@/components/site/ServiceCard'
import { PackageCard } from '@/components/site/PackageCard'
import { TestimonialCard } from '@/components/site/TestimonialCard'
import { RichText } from '@/components/site/RichText'
import { JsonLd } from '@/components/site/JsonLd'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/home/Hero'
import { ProcessTimeline } from '@/components/home/ProcessTimeline'
import { SITE_NAME, SITE_URL } from '@/lib/site'

export default async function HomePage() {
  const [services, packages, testimonials, faqs, settings] = await Promise.all([
    getServices(),
    getPackages(),
    getTestimonials(),
    getFaqs(),
    getSiteSettings(),
  ])

  const featuredServices = services.slice(0, 6)
  const previewPackages = packages.slice(0, 3)
  const previewFaqs = faqs.slice(0, 5)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: settings.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || undefined,
      addressLocality: 'Çankaya',
      addressRegion: 'Ankara',
      addressCountry: 'TR',
    },
    openingHours: 'Mo-Su 09:00-19:00',
    founder: {
      '@type': 'Person',
      name: SITE_NAME,
      jobTitle: 'Uzman Diyetisyen',
    },
  }

  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />

      {/* Hizmetler */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Uzmanlık Alanları"
            title="Sana en uygun yaklaşımı birlikte bulalım"
            description="Kilo yönetiminden insülin direncine, PCOS’tan gebelik beslenmesine kadar geniş bir uzmanlık yelpazesi."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/hizmetler">
                Tüm hizmetler
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Süreç */}
      <ProcessTimeline />

      {/* Paketler */}
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Paketler"
            title="Şeffaf fiyatlar, net içerikler"
            description="Hedeflerine uygun paketi seç; ilk görüşmeden itibaren yanındayız."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {previewPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                featured={pkg.slug === 'aylik-beslenme-diyet-takipli'}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/paketler">
                Tüm paketler & karşılaştırma
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Yorumlar */}
      {testimonials.length > 0 ? (
        <Section muted>
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Danışan Deneyimleri"
              title="“Kendimi anlaşılmış ve desteklenmiş hissettim”"
              description="Danışanların ortak teması: yargılamayan, sıcak ve yanında olan bir uzman."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
            {settings.reviewBadges && settings.reviewBadges.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {settings.reviewBadges.map((b, i) => (
                  <span
                    key={i}
                    className="border-sage-200 bg-card text-sage-900 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                  >
                    {b.source} <span className="text-apricot">★ {b.rating}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {/* SSS */}
      {previewFaqs.length > 0 ? (
        <Section>
          <Container className="flex max-w-3xl flex-col gap-10">
            <SectionHeading
              eyebrow="Sık Sorulan Sorular"
              title="Aklındaki soruların yanıtı"
            />
            <div className="flex flex-col gap-3">
              {previewFaqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group border-sage-200 rounded-xl border bg-card p-5 open:shadow-sm"
                >
                  <summary className="text-sage-900 flex cursor-pointer items-center justify-between gap-4 font-medium marker:content-none">
                    {faq.question}
                    <span className="text-sage-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="text-muted-foreground mt-3 text-sm leading-relaxed [&_p]:mb-2">
                    <RichText data={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* İletişim CTA */}
      <Section>
        <Container>
          <div className="bg-sage-900 text-sage-50 relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
            <h2 className="font-display max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
              Sağlıklı bir yolculuğa bugün başla
            </h2>
            <p className="text-sage-200 max-w-xl">
              Online ya da Ankara’da yüz yüze; sana en uygun şekilde başlayalım.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/randevu">Online randevu al</Link>
              </Button>
              {settings.phone ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-sage-50/30 bg-transparent text-sage-50 hover:bg-sage-50/10 hover:text-sage-50"
                >
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>
                    <Phone />
                    {settings.phone}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
