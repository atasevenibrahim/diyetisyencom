import type { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: 'Gizlilik & Çerez Politikası',
  description: 'Gizlilik ve çerez politikası.',
}

export default function GizlilikPage() {
  return (
    <>
      <PageHeader eyebrow="Yasal" title="Gizlilik & Çerez Politikası" />
      <Section>
        <Container className="prose max-w-3xl">
          <p>
            Bu politika, web sitemizi ziyaret ettiğinizde gizliliğinizi nasıl koruduğumuzu ve
            çerezleri nasıl kullandığımızı açıklar.
          </p>
          <h2>Toplanan Bilgiler</h2>
          <p>
            İletişim formu aracılığıyla tarafınızca iletilen bilgiler yalnızca talebinizi
            yanıtlamak amacıyla saklanır ve üçüncü taraflarla paylaşılmaz.
          </p>
          <h2>Çerezler</h2>
          <p>
            Sitenin temel işlevleri için zorunlu çerezler kullanılabilir. Tarayıcı ayarlarınızdan
            çerez tercihlerinizi yönetebilirsiniz.
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
