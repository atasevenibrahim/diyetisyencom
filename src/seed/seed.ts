import type { Payload } from 'payload'

// Düz metin paragraflarını Lexical editör state'ine çevirir (richText seed için).
const lexical = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          mode: 'normal' as const,
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})

async function upsertBySlug(
  payload: Payload,
  collection: 'services' | 'packages' | 'devices' | 'blog-posts',
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length) {
    await payload.update({
      collection,
      id: existing.docs[0].id,
      data,
    } as Parameters<typeof payload.update>[0])
    return
  }
  await payload.create({
    collection,
    data: { ...data, slug },
  } as Parameters<typeof payload.create>[0])
}

async function upsertByField(
  payload: Payload,
  collection: 'testimonials' | 'faqs',
  field: string,
  value: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
  })
  if (existing.docs.length) {
    await payload.update({
      collection,
      id: existing.docs[0].id,
      data,
    } as Parameters<typeof payload.update>[0])
    return
  }
  await payload.create({ collection, data } as Parameters<typeof payload.create>[0])
}

// İdempotent seed: Master Brief Bölüm 9 kaynak-doğru içerik + örnek kayıtlar.
export async function runSeed(payload: Payload): Promise<Record<string, number>> {
  // ---- siteSettings ----
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phone: '0850 474 10 56',
      instagram: '@uzm.dyt.ozdenozgurdurukan',
      address: 'Emek Mah. Bişkek Cad. 195/5, Çankaya/Ankara',
      workingHours: 'Her gün 09:00–19:00',
      hero: {
        heading: 'Uzm. Dyt. Özden Özgür Durukan',
        subheading:
          'Ankara/Çankaya’da kişiye özel, bilim temelli beslenme ve diyet danışmanlığı. Yanınızdaki uzmanla sürdürülebilir bir yolculuk.',
        ctaLabel: 'Online randevu al',
        ctaHref: '/randevu',
      },
      trustStats: [
        { value: '18 yıl', label: 'deneyim' },
        { value: '5.0 ★', label: 'puan' },
        { value: '5.000+', label: 'değerlendirme' },
        { value: 'Hacettepe', label: 'uzmanlık' },
      ],
      reviewBadges: [
        { source: 'Google', rating: '5.0', url: '' },
        { source: 'Doktorsitesi', rating: '5.0', url: '' },
      ],
    },
  })

  // ---- services ----
  const services = [
    {
      slug: 'kilo-verme-alma-diyetleri',
      title: 'Kilo Verme & Alma Diyetleri',
      summary:
        'Hedefinize uygun, sürdürülebilir ve kişiye özel beslenme programıyla sağlıklı kilo yönetimi.',
      icon: 'scale',
      category: 'kilo-yonetimi',
      order: 1,
    },
    {
      slug: 'insulin-direnci-diyabet',
      title: 'İnsülin Direnci & Diyabet Diyeti',
      summary:
        'Kan şekeri dengesini destekleyen, insülin direnci ve diyabette etkili beslenme planı.',
      icon: 'activity',
      category: 'insulin-direnci-diyabet',
      order: 2,
    },
    {
      slug: 'pcos-beslenmesi',
      title: 'PCOS (Polikistik Over) Beslenmesi',
      summary: 'Hormonal dengeyi ve kilo kontrolünü destekleyen, PCOS’a özel beslenme yaklaşımı.',
      icon: 'flower',
      category: 'pcos',
      order: 3,
    },
    {
      slug: 'hasimoto-beslenmesi',
      title: 'Haşimoto & Tiroid Beslenmesi',
      summary: 'Tiroid sağlığını gözeten, metabolizmayı destekleyen kişiye özel program.',
      icon: 'shield',
      category: 'hasimoto',
      order: 4,
    },
    {
      slug: 'gebelik-emzirme-beslenmesi',
      title: 'Gebelik & Emzirme Beslenmesi',
      summary: 'Anne ve bebeğin ihtiyaçlarını karşılayan, güvenli ve dengeli beslenme desteği.',
      icon: 'baby',
      category: 'gebelik-emzirme',
      order: 5,
    },
    {
      slug: 'glp1-surecinde-beslenme',
      title: 'GLP-1 (Zayıflama İğnesi) Sürecinde Beslenme',
      summary: 'GLP-1 tedavisi sürecinde kas kaybını önleyen, sürdürülebilir beslenme yönetimi.',
      icon: 'syringe',
      category: 'glp1',
      order: 6,
    },
    {
      slug: 'bolgesel-yaglanma-kilo-kontrolu',
      title: 'Bölgesel Yağlanma & Kilo Kontrolü',
      summary: 'Beslenme ve cihaz desteğiyle bölgesel incelme ve uzun vadeli kilo kontrolü.',
      icon: 'target',
      category: 'bolgesel',
      order: 7,
    },
    {
      slug: 'detoks-surdurulebilir-beslenme',
      title: 'Detoks & Sürdürülebilir Beslenme',
      summary: 'Toksin yükünü azaltan, kalıcı alışkanlıklar kazandıran dengeli yaklaşım.',
      icon: 'leaf',
      category: 'surdurulebilir',
      order: 8,
    },
    {
      slug: 'online-yuz-yuze-danismanlik',
      title: 'Online & Yüz Yüze Danışmanlık',
      summary: 'Türkiye’nin her yerinden online ya da Ankara’da yüz yüze, esnek danışmanlık.',
      icon: 'video',
      category: 'danismanlik',
      order: 9,
    },
    {
      slug: 'vucut-analizi',
      title: 'Vücut Analizi & Yorumlama',
      summary:
        'Detaylı vücut kompozisyonu analizi ve uzman yorumuyla net bir başlangıç noktası.',
      icon: 'gauge',
      category: 'diger',
      order: 10,
    },
  ]
  for (const { slug, ...rest } of services) {
    await upsertBySlug(payload, 'services', slug, { ...rest, body: lexical([rest.summary]) })
  }

  // ---- packages ----
  const firstNote = 'İlk geldiğiniz görüşmede ücret alınmaktadır.'
  const packages = [
    {
      slug: 'standart-beslenme-diyet-takip',
      name: 'Standart Beslenme ve Diyet Takip Paketi',
      summary:
        '1 ay içinde 2 görüşme (15 gün arayla) + 2 farklı program. Vücut analizi, çok kanallı takip ve motivasyon desteği.',
      sessions: 2,
      durationWeeks: 4,
      price: 5500,
      features: [
        { feature: '1 ay içinde 2 görüşme (15 gün arayla)' },
        { feature: '2 farklı kişiye özel program' },
        { feature: 'Vücut analizi' },
        { feature: 'Çok kanallı takip & motivasyon desteği' },
      ],
      familyDiscount: true,
      note: firstNote,
      order: 1,
    },
    {
      slug: 'siki-beslenme-diyet-takip',
      name: 'Sıkı Beslenme ve Diyet Takip Paketi',
      summary: '1 ay içinde ardışık 4 hafta görüşme + 2 program. Daha yoğun takip isteyenler için.',
      sessions: 4,
      durationWeeks: 4,
      price: 5900,
      features: [
        { feature: '1 ay içinde ardışık 4 hafta görüşme' },
        { feature: '2 farklı kişiye özel program' },
        { feature: 'Yoğun takip & motivasyon' },
      ],
      familyDiscount: true,
      note: firstNote,
      order: 2,
    },
    {
      slug: 'aylik-beslenme-diyet-takipli',
      name: 'Aylık Beslenme ve Diyet Takipli Paket',
      summary: '3 ay / toplam 6 görüşme (2 haftada 1). Uzun vadeli hedefler için avantajlı paket.',
      sessions: 6,
      durationWeeks: 12,
      price: 14800,
      oldPrice: 16500,
      discountNote: 'Avantajlı 3 aylık paket',
      features: [
        { feature: '3 ay / toplam 6 görüşme (2 haftada 1)' },
        { feature: 'Sürekli kişiye özel program güncellemesi' },
        { feature: 'Çok kanallı takip & motivasyon' },
      ],
      familyDiscount: true,
      note: firstNote,
      order: 3,
    },
    {
      slug: 'aylik-siki-beslenme-diyet-takipli',
      name: 'Aylık Sıkı Beslenme ve Diyet Takipli Paket',
      summary: '3 ay / ardışık 12 hafta görüşme. En yoğun ve en kapsamlı takip programı.',
      sessions: 12,
      durationWeeks: 12,
      price: 16400,
      oldPrice: 17700,
      discountNote: 'En kapsamlı 3 aylık paket',
      features: [
        { feature: '3 ay / ardışık 12 hafta görüşme' },
        { feature: 'Haftalık program güncellemesi' },
        { feature: 'Öncelikli & çok kanallı takip' },
      ],
      familyDiscount: true,
      note: firstNote,
      order: 4,
    },
    {
      slug: 'vucut-analizi-paketi',
      name: 'Vücut Analizi (ve Yorumlama)',
      summary: 'Detaylı vücut kompozisyonu analizi ve uzman yorumlaması.',
      sessions: 1,
      price: 2500,
      features: [
        { feature: 'Detaylı vücut kompozisyonu ölçümü' },
        { feature: 'Uzman yorumlaması' },
      ],
      familyDiscount: false,
      order: 5,
    },
  ]
  for (const { slug, ...rest } of packages) {
    await upsertBySlug(payload, 'packages', slug, rest)
  }

  // ---- devices ----
  const devices = [
    {
      slug: 'andulasyon-terapisi',
      name: 'Andulasyon Terapisi',
      tagline: 'Biyolojik rezonans titreşim + mekanik vibrasyon + kızılötesi derin ısı.',
      description: lexical([
        'Andulasyon; biyolojik rezonans titreşim, mekanik vibrasyon ve kızılötesi derin ısıyı birleştiren bütüncül bir terapidir.',
        'Bölgesel incelme, ödem atımı ve genel iyilik halini destekler.',
      ]),
      benefits: [
        { benefit: 'Bölgesel incelme' },
        { benefit: 'Ödem atımı' },
        { benefit: 'Selülit azaltımı' },
        { benefit: 'Kolajen üretimi & cilt sıkılaştırma' },
        { benefit: 'Metabolizmayı hızlandırma' },
        { benefit: 'Ağrı & kramp azaltma' },
        { benefit: 'Uyku kalitesini artırma' },
        { benefit: 'Toksin atımı' },
      ],
      order: 1,
    },
    {
      slug: 'ems',
      name: 'EMS',
      tagline: '30 dakikalık yoğun kas uyarımı — ameliyatsız vücut şekillendirme.',
      description: lexical([
        'EMS, 30 dakikalık seanslarla yoğun kas uyarımı sağlayarak ameliyatsız vücut şekillendirmeye yardımcı olur.',
        'İyileşme süresi gerektirmez.',
      ]),
      benefits: [
        { benefit: 'Bölgesel incelme' },
        { benefit: 'Kan dolaşımını artırma' },
        { benefit: 'Kas gelişimi' },
        { benefit: 'Metabolizmayı hızlandırma' },
        { benefit: 'Yağ parçalanması' },
        { benefit: 'Ameliyatsız vücut şekillendirme' },
      ],
      order: 2,
    },
    {
      slug: 'rollshine',
      name: 'RollShine',
      tagline: 'Egzersiz sonrası kas gevşetme için ideal.',
      description: lexical([
        'RollShine; selülit azaltma, dolaşım ve kas gevşetmeyi destekleyen çok yönlü bir cihazdır.',
        'Kromaterapi ve hava iyonizasyonu ile konforlu bir deneyim sunar.',
      ]),
      benefits: [
        { benefit: 'Selülit azaltma' },
        { benefit: 'Dolaşımı destekleme' },
        { benefit: 'Ağrı hafifletme' },
        { benefit: 'Kromaterapi' },
        { benefit: 'Kolajen üretimi' },
        { benefit: 'Hava iyonizasyonu' },
      ],
      order: 3,
    },
  ]
  for (const { slug, ...rest } of devices) {
    await upsertBySlug(payload, 'devices', slug, rest)
  }

  // ---- testimonials (placeholder, consent=true) ----
  const testimonials = [
    {
      name: 'A. Y.',
      initials: 'A.Y.',
      rating: 5,
      text: 'Kendimi anlaşılmış ve desteklenmiş hissettim. Program hayatıma kolayca uydu, hedefime ulaştım.',
      source: 'Google' as const,
      service: 'Kilo Yönetimi',
      consent: true,
    },
    {
      name: 'M. K.',
      initials: 'M.K.',
      rating: 5,
      text: 'İnsülin direncim için çok şey değişti. Hem tok kaldım hem de değerlerim düzeldi.',
      source: 'Doktorsitesi' as const,
      service: 'İnsülin Direnci',
      consent: true,
    },
    {
      name: 'E. D.',
      initials: 'E.D.',
      rating: 5,
      text: 'Gebelik sürecimde güvenle beslendim. Her sorumda yanımdaydı, çok teşekkürler.',
      source: 'Direct' as const,
      service: 'Gebelik Beslenmesi',
      consent: true,
    },
  ]
  for (const t of testimonials) {
    await upsertByField(payload, 'testimonials', 'name', t.name, t)
  }

  // ---- faqs ----
  const faqs = [
    {
      question: 'İlk görüşme nasıl ilerliyor?',
      answer: lexical([
        'İlk görüşmede sağlık geçmişiniz, alışkanlıklarınız ve hedefleriniz detaylıca değerlendirilir; size özel bir plan oluşturulur. İlk görüşme en fazla 40 dakikadır.',
      ]),
      category: 'randevu',
      order: 1,
    },
    {
      question: 'Online danışmanlık veriyor musunuz?',
      answer: lexical([
        'Evet. Türkiye’nin her yerinden online danışmanlık alabilir, programınızı ve takibinizi uzaktan sürdürebilirsiniz.',
      ]),
      category: 'online',
      order: 2,
    },
    {
      question: 'Paket ücretlerine neler dahil?',
      answer: lexical([
        'Paketler; kişiye özel programlar, vücut analizi ve çok kanallı takip içerir. İlk geldiğiniz görüşmede ücret alınmaktadır.',
      ]),
      category: 'paketler',
      order: 3,
    },
    {
      question: 'Randevumu erteleyebilir miyim?',
      answer: lexical([
        'Standart pakette en fazla 1 hafta, 3 aylık paketlerde 2 haftaya kadar erteleme hakkınız bulunur.',
      ]),
      category: 'randevu',
      order: 4,
    },
  ]
  for (const f of faqs) {
    await upsertByField(payload, 'faqs', 'question', f.question, f)
  }

  // ---- blog (örnek) ----
  await upsertBySlug(payload, 'blog-posts', 'insulin-direnci-nedir', {
    title: 'İnsülin Direnci Nedir, Beslenmeyle Nasıl Yönetilir?',
    excerpt:
      'İnsülin direncinin belirtileri ve beslenmeyle yönetiminde işe yarayan pratik adımlar.',
    body: lexical([
      'İnsülin direnci, hücrelerin insüline yanıtının azalmasıyla kan şekeri dengesinin bozulmasıdır.',
      'Dengeli, lif açısından zengin ve düzenli öğünlerle desteklenen bir beslenme planı, insülin direncinin yönetiminde önemli rol oynar.',
    ]),
    category: 'hastaliklar',
    publishedAt: new Date().toISOString(),
  })

  const counts: Record<string, number> = {}
  for (const c of [
    'services',
    'packages',
    'devices',
    'testimonials',
    'faqs',
    'blog-posts',
  ] as const) {
    counts[c] = (await payload.count({ collection: c })).totalDocs
  }
  return counts
}
