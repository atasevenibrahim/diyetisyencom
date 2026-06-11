import { Container } from '@/components/site/Container'
import { SectionHeading } from '@/components/site/SectionHeading'

const steps = [
  {
    title: 'İlk Görüşme',
    text: 'Sağlık geçmişin, alışkanlıkların ve hedeflerin detaylıca dinlenir. Seni anlamakla başlıyoruz.',
  },
  {
    title: 'Analiz',
    text: 'Vücut analizi ve değerlendirmeyle mevcut durumun net bir resmini birlikte çıkarıyoruz.',
  },
  {
    title: 'Kişiye Özel Program',
    text: 'Yaşamına uyan, sürdürülebilir ve bilim temelli bir beslenme planı hazırlanır.',
  },
  {
    title: 'Takip & Motivasyon',
    text: 'Çok kanallı takip ve düzenli kontrollerle yolun her adımında yanındayız.',
  },
]

export function ProcessTimeline() {
  return (
    <section className="bg-sage-50 py-16 sm:py-20 lg:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Senin Yolculuğun"
          title="Birlikte, adım adım"
          description="Klişe diyet değil; sana özel, sürdürülebilir bir süreç. İşte yolculuğun dört adımı."
        />

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* masaüstü bağlantı çizgisi */}
          <div
            aria-hidden="true"
            className="bg-sage-200 absolute top-6 right-0 left-0 hidden h-px lg:block"
          />
          {steps.map((step, i) => (
            <li key={i} className="relative flex flex-col items-start gap-3">
              <span className="bg-apricot text-accent-foreground ring-sage-50 relative z-10 flex size-12 items-center justify-center rounded-full text-lg font-semibold ring-8">
                {i + 1}
              </span>
              <h3 className="text-sage-900 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
