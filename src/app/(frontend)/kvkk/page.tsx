import type { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'Kişisel verilerin korunması hakkında aydınlatma metni.',
}

export default function KvkkPage() {
  return (
    <>
      <PageHeader eyebrow="Yasal" title="KVKK Aydınlatma Metni" />
      <Section>
        <Container className="prose max-w-3xl">
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, Uzm. Dyt. Özden Özgür
            Durukan tarafından kişisel verileriniz veri sorumlusu sıfatıyla aşağıda açıklanan
            kapsamda işlenmektedir.
          </p>
          <h2>İşlenen Veriler ve Amaçlar</h2>
          <p>
            Randevu, danışmanlık ve iletişim süreçlerinin yürütülmesi amacıyla; ad-soyad, iletişim
            bilgileri ve sağlık durumunuza ilişkin tarafınızca paylaşılan veriler işlenir. Sağlık
            verileri özel nitelikli kişisel veri olup yalnızca açık rızanızla işlenir.
          </p>
          <h2>Haklarınız</h2>
          <p>
            KVKK’nın 11. maddesi kapsamında; verilerinize erişme, düzeltilmesini veya silinmesini
            isteme ve işlemeye itiraz etme haklarına sahipsiniz. Taleplerinizi iletişim
            kanallarımız üzerinden iletebilirsiniz.
          </p>
          <p>
            <em>
              Bu metin bir taslaktır ve yayın öncesinde hukuki danışmanlık ile nihai hale
              getirilecektir.
            </em>
          </p>
        </Container>
      </Section>
    </>
  )
}
