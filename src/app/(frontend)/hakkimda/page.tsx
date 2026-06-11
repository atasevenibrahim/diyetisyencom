import type { Metadata } from 'next'
import { Award, GraduationCap, HeartHandshake, Leaf, Sparkles, Stethoscope } from 'lucide-react'

import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'
import { CtaBand } from '@/components/site/CtaBand'

export const metadata: Metadata = {
  title: 'Hakkımda',
  description:
    '2008’den beri 18 yıl deneyimli uzman diyetisyen Özden Özgür Durukan. Başkent Üniversitesi lisans, Hacettepe Üniversitesi uzmanlık. Ankara/Çankaya.',
}

const milestones = [
  {
    icon: GraduationCap,
    title: 'Eğitim',
    text: 'Başkent Üniversitesi (lisans) ve Hacettepe Üniversitesi (uzmanlık) — sağlam bir akademik temel.',
  },
  {
    icon: Stethoscope,
    title: 'Klinik Deneyim',
    text: 'Başkent Üniversitesi Hastanesi ve Ankara Güven Hastanesi’nde edinilen güçlü klinik tecrübe.',
  },
  {
    icon: Award,
    title: '18 Yıl & 5.0 Puan',
    text: '2008’den bu yana binlerce danışan; yüksek hacimli olumlu değerlendirme ve 5.0 memnuniyet.',
  },
]

const values = [
  {
    icon: HeartHandshake,
    title: 'Yargılamayan, sıcak yaklaşım',
    text: 'Danışanların ortak teması: “kendimi anlaşılmış ve desteklenmiş hissettim.” Klinik soğukluğu yok.',
  },
  {
    icon: Sparkles,
    title: 'Kişiye özel program',
    text: 'Hazır kalıplar değil; yaşamına, sağlık geçmişine ve hedeflerine göre tasarlanan planlar.',
  },
  {
    icon: Leaf,
    title: 'Bilim temelli & sürdürülebilir',
    text: 'Geçici diyetler değil; kalıcı alışkanlıklara dönüşen, bilimsel temelli bir yol.',
  },
]

export default function HakkimdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımda"
        title="Yanınızdaki uzman: Özden Özgür Durukan"
        description="2008’den beri, Ankara/Çankaya’da kişiye özel ve bilim temelli beslenme danışmanlığı."
      />

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="from-sage-200 to-sage-50 ring-sage-200 flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-gradient-to-br ring-1">
              <span className="bg-sage-700 text-primary-foreground flex size-20 items-center justify-center rounded-full">
                <Leaf className="size-9" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-sage-900 text-2xl font-semibold sm:text-3xl">
              18 yıllık deneyim, tek bir hedefte buluşuyor: siz
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Uzm. Dyt. Özden Özgür Durukan, 2008’den bu yana beslenme ve diyet alanında
              danışanlarına eşlik ediyor. Başkent Üniversitesi’ndeki lisans eğitiminin ardından
              Hacettepe Üniversitesi’nde uzmanlığını tamamladı.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Başkent Üniversitesi Hastanesi ve Ankara Güven Hastanesi’ndeki klinik deneyimiyle;
              kilo yönetiminden insülin direncine, PCOS’tan gebelik beslenmesine kadar geniş bir
              yelpazede, kişiye özel ve sürdürülebilir programlar hazırlıyor.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Yaklaşımının merkezinde tek bir şey var: yargılamadan, sıcak bir şekilde ve bilim
              temelli olarak yanınızda olmak.
            </p>
          </div>
        </Container>
      </Section>

      <Section muted>
        <Container className="grid gap-6 md:grid-cols-3">
          {milestones.map((m) => (
            <div
              key={m.title}
              className="border-sage-200 flex flex-col gap-3 rounded-2xl border bg-card p-6"
            >
              <span className="bg-sage-50 text-sage-700 flex size-12 items-center justify-center rounded-xl">
                <m.icon className="size-6" />
              </span>
              <h3 className="text-sage-900 text-lg font-semibold">{m.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.text}</p>
            </div>
          ))}
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-8">
          <h2 className="text-sage-900 text-2xl font-semibold sm:text-3xl">Yaklaşımım</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3">
                <span className="text-apricot">
                  <v.icon className="size-7" />
                </span>
                <h3 className="text-sage-900 text-lg font-semibold">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
