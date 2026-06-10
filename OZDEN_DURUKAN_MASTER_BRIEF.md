# MASTER BRIEF — Uzm. Dyt. Özden Özgür Durukan Web Sitesi

> Bu doküman, projenin tek doğruluk kaynağıdır (single source of truth) ve aynı zamanda
> Claude Code için çalışma yönergesidir. Projeye `CLAUDE.md` olarak da koyabilirsin.
> Ajan her oturumda bu dosyayı okumalı ve kararları buna göre vermelidir.

---

## 0. Amaç ve özet

Ankara/Çankaya'da çalışan, 18 yıllık deneyimli bir uzman diyetisyen için **tam markalı,
hızlı, mobil öncelikli, online randevulu** bir web sitesi inşa ediyoruz. Site;
hizmetleri ve paketleri tanıtır, güven inşa eder, ziyaretçiyi **online randevuya** dönüştürür
ve diyetisyenin **tek bir panelden** hem içeriği hem randevuları yönetmesini sağlar.

**Birincil dönüşüm hedefi:** ziyaretçi → online randevu.
**İkincil hedefler:** WhatsApp/telefon iletişimi, blog üzerinden SEO trafiği, marka güveni.

---

## 1. Marka & ton (kimlik özeti)

- **Kişi:** Uzm. Dyt. Özden Özgür Durukan. 2008'den beri 18 yıl deneyim; Başkent Üniversitesi
  (lisans/diploma), Hacettepe Üniversitesi (uzmanlık). Geçmiş deneyim: Başkent Üni. Hastanesi,
  Ankara Güven Hastanesi. 5.0 puan, yüksek hacimli olumlu değerlendirme.
- **Hedef kitle:** ağırlıklı kadın, 25–55 yaş, kilo yönetimi / insülin direnci / PCOS / Haşimato /
  gebelik beslenmesi / bölgesel incelme arayan, Ankara yerel + Türkiye geneli online danışan.
- **Ses tonu:** sıcak, güler yüzlü, pozitif, **kişiye özel**, bilim temelli, motive edici;
  disiplinli ama yargılamayan. "Yanındaki uzman" hissi — klinik soğukluğu YOK, influencer
  havası da YOK. Danışan yorumlarındaki ortak tema: "kendimi anlaşılmış ve desteklenmiş hissettim".
- **Yazım kuralları:** Türkçe, cümle düzeni doğal ve net; abartılı pazarlama dili değil, somut
  fayda. Aktif fiil ("Randevu al", "Programını oluştur"). Tıbbi vaat verme; "yardımcı olur",
  "destekler" gibi sorumlu dil kullan.

---

## 2. Teknoloji yığını (kesinleşti)

| Katman | Tercih | Not |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | RSC, route handlers, `next/font`, `next/image` |
| Stil | **Tailwind CSS** | Tasarım token'ları CSS değişkenleri + Tailwind theme |
| Bileşenler | **shadcn/ui** | shadcn MCP üzerinden kur; prop uydurma yok |
| CMS + Backend + Admin | **Payload CMS 3** (Next.js içinde gömülü) | Tek admin panel: içerik + randevu |
| Veritabanı | **PostgreSQL** | Payload Postgres adapter. Yönetilen Postgres (Neon / Vercel Postgres / Supabase Postgres) |
| Barındırma | **Vercel** | Postgres yönetilen serviste; cron için Vercel Cron |
| E-posta | **Resend** (veya Nodemailer/SMTP) | onay/hatırlatma/iptal |
| SMS | **NetGSM** (veya İletimerkezi) | KVKK izni + onaylı başlık gerekir |
| WhatsApp | **Meta WhatsApp Business Cloud API** (alternatif: 360dialog/Twilio) | Onaylı şablon + işletme doğrulaması gerekir, kurulum süresi uzun olabilir |

**Önemli mimari ilke:** Ödeme şimdilik YOK ama mimari sonradan eklenebilir olmalı.
`Appointment` modelinde `paymentStatus` ve `paymentProvider` alanlarını baştan bırak;
ödeme adımını opsiyonel bir aşama olarak soyutla.

---

## 3. Eklenti / MCP zinciri ve NE ZAMAN kullanılacağı

Kurulumdan sonra `/mcp` ile bağlı olduklarını doğrula. Ajan, aşağıdaki "ne zaman" kurallarına uymalı.

### 3.1 Kurulum komutları
```bash
# Chrome DevTools MCP (canlı debug + performans + responsive doğrulama)
claude mcp add chrome-devtools --scope user -- npx -y chrome-devtools-mcp@latest

# 21st.dev Magic MCP (özgün bileşen üretimi)
claude mcp add magic --scope user --env API_KEY="<21ST_DEV_API_KEY>" -- npx -y @21st-dev/magic@latest
```
shadcn MCP için proje köküne `.mcp.json`:
```json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["-y", "shadcn@latest", "mcp"] }
  }
}
```
`frontend-design` ve "web design guidelines" zaten skill/araç olarak mevcut; ajan bunları
tasarım kararları ve denetim için çağırır.

### 3.2 Kullanım kuralları (ajan için)
- **frontend-design (skill):** Her yeni ekran/sayfa tasarımından ÖNCE çağır. Brainstorm → token →
  ASCII wireframe → öz-eleştiri → kod akışını uygula. Bölüm 5'teki token'ları başlangıç kabul et,
  ama klişe görünmemesi için kendi kritik turunu da yap.
- **shadcn MCP:** Bir bileşen gerektiğinde önce shadcn kataloğunda ara, gerçek prop'larla kur.
  "Hayali prop" veya kırık kurulum YASAK. Dosyalar `components/ui/` altına insin.
- **Magic MCP:** shadcn'de karşılığı olmayan **özgün** bileşenler için (ör. randevu slot seçici,
  süreç zaman çizelgesi, cihaz kartı). Ürettiğin her şeyi Bölüm 5 token'larına hizala.
- **chrome-devtools-mcp:** Her sayfa "bitti" demeden önce: ekran görüntüsü al, console hatalarını
  kontrol et, performans trace çalıştır, mobil/masaüstü responsive ve klavye/focus doğrula.
  Hataları bir sonraki adıma geçmeden düzelt. (build → screenshot → kritik → düzelt döngüsü)
- **web design guidelines:** Sayfa tamamlandığında tasarım denetimi (audit) için çağır; bulguları
  gider. En az anasayfa, paketler, randevu ve blog detayında uygula.

---

## 4. Site mimarisi (sitemap)

```
/                         Anasayfa (hero + güven + hizmet özet + süreç + yorumlar + randevu CTA)
/hakkimda                 Diyetisyen profili, eğitim, deneyim, sertifikalar, yaklaşım
/hizmetler                Tüm hizmet/uzmanlık alanları (grid)
/hizmetler/[slug]         Tekil hizmet (ör. insülin-direnci, pcos, gebelik-beslenmesi)
/paketler                 Paketler + şeffaf fiyatlar + karşılaştırma + randevu CTA
/cihazlar                 Andulasyon / EMS / RollShine genel
/cihazlar/[slug]          Tekil cihaz detayı
/randevu                  Online randevu akışı (hizmet/paket → tarih → slot → bilgiler → onay)
/blog                     Blog listesi (kategori filtreli)
/blog/[slug]              Blog yazısı (Article schema)
/iletisim                 Adres + harita + telefon + WhatsApp + çalışma saatleri + form
/danisan-formu            Online Bilgi Formu (yeni danışan ön kayıt — 4 bölüm) [KVKK rızalı]
/tetkikler                İstenen tetkikler listesi (yazdırılabilir / PDF indirilebilir)
/kvkk, /gizlilik          KVKK aydınlatma + gizlilik/çerez politikası
/admin                    Payload yönetim paneli (içerik + randevu + danışanlar)
```

---

## 5. Tasarım sistemi — "Sıcak & Doğal" (adaçayı yeşili)

> AI klişesinden (krem + serif display + terracotta) bilinçli kaçınıyoruz. Birincil renk
> **adaçayı yeşili** (sağlık, tazelik, güven), tek sıcak vurgu **kayısı**, zemin temiz sıcak nötr.
> Aşağıdaki token'lar başlangıç noktasıdır; ajan frontend-design ile rafine etmeli.

### 5.1 Renk token'ları (başlangıç)
```css
--sage-900: #2C3A31;  /* en koyu — başlık/derinlik */
--sage-700: #4F6B58;  /* BİRİNCİL marka yeşili */
--sage-500: #6E8C76;  /* orta ton */
--sage-200: #C9D6CB;  /* yumuşak tint — yüzeyler */
--sage-50:  #EEF2EC;  /* en açık yıkama — bölüm zeminleri */
--sand:     #F7F4ED;  /* sıcak kırık beyaz — sayfa zemini */
--ink:      #28302B;  /* metin (saf siyah değil) */
--apricot:  #E59A6C;  /* TEK sıcak vurgu — CTA/enerji, az kullan */
--brass:    #B08D57;  /* premium/cihaz ince detay — çok az kullan */
```
- Kontrast: tüm metin/zemin kombinasyonları WCAG AA geçmeli (özellikle sage üstü metin).
  CTA `--apricot` üstünde koyu metin tercih et; gerekirse tonu koyulaştır.
- Vurguyu tek yerde harca: sıcak kayısı yalnızca birincil eylemlerde.

### 5.2 Tipografi (başlangıç önerisi)
- **Display:** karakterli, sıcak bir yüz — ör. **Fraunces** (opsiyonel italic/soft).
- **Body:** temiz, çok okunur humanist sans — ör. **Hanken Grotesk** veya **Figtree**.
- **ZORUNLU:** Türkçe glif kapsamını doğrula (İ, ı, ş, ğ, ç, ö, ü). `next/font` ile yükle,
  `font-display: swap`. Klişe Playfair+Inter ikilisini varsayılan olarak kullanma.
- Net tip ölçeği kur (örn. 1.250 minör üçlü); başlıklarda ağırlık/aralık bilinçli olsun.

### 5.3 İmza unsuru (signature)
- **Hero:** diyetisyenin gerçek portresi + canlı **güven şeridi** (18 yıl deneyim · 5.0 ★ ·
  Hacettepe uzmanlık · 5.000+ değerlendirme) + birincil "Online randevu al" CTA'sı.
- **"Senin Yolculuğun" süreci:** ilk görüşme → analiz → kişiye özel program → takip/motivasyon
  adımlarını anlatan, scroll ile beliren bir akış (gerçek bir süreç olduğu için numaralandırma uygun).
- Restraint: adaçayı'dan türetilen ince organik yaprak/kontur motifi bölüm ayıracı olarak,
  çok ölçülü. Motion: nazik scroll-reveal + hover micro-interaction; `prefers-reduced-motion` saygılı.

---

## 6. Veri modeli (Payload collections)

> Hepsi tek panelden yönetilir. Slug'lar Türkçe, alan adları İngilizce (kod tutarlılığı).

- **users** — admin (diyetisyen + asistan), rol bazlı erişim.
- **media** — görseller (next/image ile optimize).
- **siteSettings (global)** — iletişim (telefon 0850 474 10 56, WhatsApp, Instagram
  @uzm.dyt.ozdenozgurdurukan), adres (Emek Mah. Bişkek Cad. 195/5, Çankaya/Ankara),
  çalışma saatleri (Her gün 09:00–19:00), hero metni, güven istatistikleri.
- **services** — `title, slug, summary, icon, category, body(richtext), seo`.
- **packages** — `name, slug, summary, sessions, durationWeeks, price, oldPrice, discountNote,
  features[], familyDiscount(bool), order`.
- **devices** — `name, slug, tagline, description, benefits[], image`.
- **blogPosts** — `title, slug, excerpt, cover, body(richtext), category, publishedAt, seo`.
- **testimonials** — `name/initials, rating, text, source(Google|Doktorsitesi|Direct),
  service, date, consent(bool)`. (Üçüncü taraf yorumlarını toptan kopyalama; küratörlü ve
  rıza/atıfla kullan. Toplu sosyal kanıt için "Google 5.0 / Doktorsitesi 5.0" rozeti + dış link.)
- **faqs** — `question, answer, category`.
- **appointments** — `clientName, phone, email, type(in_person|online), service|package,
  date, startTime, durationMin, status(pending|confirmed|cancelled|rescheduled|completed|no_show),
  notes, remindersSent[], kvkkConsent(bool), paymentStatus(none|...), paymentProvider`.
- **availability / schedule** — haftalık çalışma saatleri, istisna günler/tatiller, bloklu slotlar,
  hizmet bazlı süre. (Çift rezervasyon engeli burada modellenir.)
- **leads / contactSubmissions** — iletişim formu kayıtları.
- **intakeForms** — online Bilgi Formu (Bölüm 9), bir danışan/randevu ile ilişkili, KVKK rızalı.

---

## 7. Randevu sistemi spesifikasyonu

Akış: **Hizmet/Paket seç → Tarih seç → Müsait slot seç → İletişim + KVKK rızası → Onay**.

Kurallar (dokümandan, CMS'ten ayarlanabilir):
- **Süreler:** ilk görüşme **max 40 dk**, kontroller **20–30 dk**. Süre, seçilen hizmete göre.
- **Gecikme toleransı:** randevu saatinden **max 5 dk** (bilgi notu olarak göster).
- **Erteleme:** standart pakette **en fazla 1 hafta**, 3 aylık paketlerde **2 hafta** erteleme hakkı
  (kural alanını ayarlanabilir yap).
- **Hatırlatma:** randevudan **1 gün önce** otomatik (Bölüm 8).
- Çift rezervasyon engeli (atomik slot kilidi), saat dilimi `Europe/Istanbul`.
- Statü yaşam döngüsü ve admin panelinden manuel onay/iptal/erteleme/ tamamlandı/no-show.
- İptal/erteleme için danışana benzersiz bağlantı (token'lı) opsiyonel — sonraki faz.

---

## 8. Bildirim sistemi (e-posta + SMS + WhatsApp)

Tek bir **NotificationService** soyutlaması; kanal adaptörleri (email/sms/whatsapp) ve olay başına
kanal aç/kapat (siteSettings'ten). Zamanlanmış hatırlatmalar için **Vercel Cron** + kuyruk tablosu
(veya Inngest/Trigger.dev), retry'lı.

Olaylar: `appointment.created` (onay), `appointment.reminder` (24s önce),
`appointment.rescheduled`, `appointment.cancelled`.

- **E-posta:** Resend; markalı şablon (sage/kayısı).
- **SMS:** NetGSM; **KVKK ticari elektronik ileti izni** + onaylı gönderici başlığı gerekir.
- **WhatsApp:** Meta Cloud API; **işletme doğrulaması + onaylı mesaj şablonları** gerekir —
  kurulum lead-time'ı uzun olabilir, projeyi bu olmadan da çalışacak şekilde kur (graceful fallback).

---

## 9. İçerik kaynağı (kaynak-doğru — CMS'e bunlar girilecek)

### 9.1 Paketler ve fiyatlar
- **Standart Beslenme ve Diyet Takip Paketi** — 1 ay içinde 2 görüşme (15 gün arayla) + 2 farklı
  program; vücut analizi, çok kanallı takip, motivasyon desteği. **5.500 TL**.
- **Sıkı Beslenme ve Diyet Takip Paketi** — 1 ay içinde ardışık 4 hafta görüşme + 2 program.
  **5.900 TL**.
- **Aylık Beslenme ve Diyet Takipli Paket** — 3 ay / toplam 6 görüşme (2 haftada 1).
  ~~16.500 TL~~ → **14.800 TL**.
- **Aylık Sıkı Beslenme ve Diyet Takipli Paket** — 3 ay / ardışık 12 hafta görüşme.
  ~~17.700 TL~~ → **16.400 TL**.
- **Aile Paketleri** — siz + en az 1 aile bireyi seçilen pakette **%10 indirimli**.
- **Vücut Analizi** (ve yorumlama) — **2.500 TL**.
- Not: "İlk geldiğiniz görüşmede ücret alınmaktadır" bilgisini paketlerde göster.

### 9.2 Cihazlar
- **Andulasyon Terapisi** — biyolojik rezonans titreşim + mekanik vibrasyon + kızılötesi derin ısı;
  bölgesel incelme, ödem atımı, selülit azaltımı, kolajen/cilt sıkılaştırma, metabolizma,
  ağrı/kramp azaltma, uyku kalitesi, toksin atımı.
- **EMS** — 30 dk yoğun kas uyarımı; bölgesel incelme, kan dolaşımı, kas gelişimi, metabolizma,
  yağ parçalanması; ameliyatsız vücut şekillendirme, iyileşme süresi gerektirmez.
- **RollShine** — selülit azaltma, dolaşım, ağrı hafifletme, kromaterapi, kolajen, hava iyonizasyonu;
  egzersiz sonrası kas gevşetme için ideal.

### 9.3 Hizmet/uzmanlık alanları
Kilo verme/alma diyetleri, insülin direnci & diyabet diyeti, PCOS, Haşimato, gebelik & emzirme
beslenmesi, GLP-1 (zayıflama iğnesi) sürecinde beslenme, bölgesel yağlanma & kilo kontrolü, detoks,
sigaraya bağlı kilo problemleri, sürdürülebilir beslenme, online & yüz yüze danışmanlık, vücut analizi.

### 9.4 Online Bilgi Formu (4 bölüm) — `/danisan-formu`
- **I. Bölüm:** kimlik/iletişim, kilo öyküsü, sağlık geçmişi (sindirim, kalp-damar, diyabet,
  hormonal, böbrek, adet düzeni, operasyon, ilaç, vitamin), aile öyküsü, çalışma/öğün saatleri,
  sevdiği/sevmediği/alerjik besinler, aktivite düzeyi, ruh hali-beslenme ilişkisi, sigara,
  geçmiş diyet, başvuru nedeni ve hedef.
- **II. Bölüm:** 25 maddelik beslenme alışkanlığı öz-değerlendirmesi (Her zaman/Bazen/Hiçbir zaman).
- **III. Bölüm:** 1 günlük besin tüketim formu (hafta içi + hafta sonu).
- **IV. Bölüm:** istenen tetkikler (aşağıda).
- Form **çok adımlı** olsun, taslak kaydedilebilsin; **KVKK açık rıza** olmadan gönderilemez.

### 9.5 İstenen tetkikler — `/tetkikler` (yazdırılabilir + PDF)
Glukoz, AST, ALT, BUN, Kreatinin, Ürik asit, Sodyum, Potasyum, Total Kalsiyum, Serum demir,
Total demir bağlama kapasitesi, Total Kolesterol, Trigliserit, HDL, LDL, FT3, FT4, TSH,
HOMA-IR (insülin direnci), B12, Hemogram, Ferritin, 25-OH D Vitamini.

---

## 10. KVKK / yasal (ZORUNLU)

- Randevu ve Bilgi Formu **özel nitelikli kişisel veri (sağlık)** toplar → **aydınlatma metni** +
  **açık rıza** onay kutusu (önceden işaretli olamaz) zorunlu.
- Ticari ileti (SMS/WhatsApp/e-posta hatırlatma) için **ayrı açık rıza**.
- `/kvkk` aydınlatma metni, `/gizlilik` gizlilik & çerez politikası, çerez onay banner'ı.
- Veriyi minimum topla, güvenli sakla; admin erişimi rol bazlı.

---

## 11. SEO / performans / erişilebilirlik

- **Yerel SEO:** schema.org `LocalBusiness`/`MedicalBusiness` + `Person`, NAP tutarlılığı (Ankara,
  Çankaya), `FAQPage`, blog için `Article`. `sitemap.xml`, `robots.txt`, kanonik, OG görselleri.
- Anahtar niyetler: "Ankara diyetisyen", "Çankaya diyetisyen", "insülin direnci diyetisyen Ankara",
  "online diyet", "PCOS beslenme" vb.
- **Performans:** Core Web Vitals bütçesi; `next/image`, `next/font`, RSC, kod bölme. Lighthouse'u
  chrome-devtools-mcp ile her ana sayfada doğrula (hedef: mobil ≥ 90).
- **Erişilebilirlik:** WCAG AA; klavye navigasyonu, görünür focus, kontrast, `prefers-reduced-motion`,
  anlamlı alt metinleri, form etiketleri.

---

## 12. Yol haritası (fazlar + kabul kriterleri)

**Faz 0 — Temel & araçlar.** Repo, TS+ESLint+Prettier, Tailwind, shadcn init, Payload+Postgres
scaffold, MCP kurulumları, CI, `.env` şablonu, tasarım token'ları.
*Kabul:* `pnpm dev` çalışır, `/admin` açılır, `/mcp` üç sunucuyu bağlı gösterir.

**Faz 1 — Tasarım sistemi + içerik sayfaları.** Token rafine (frontend-design), temel bileşenler,
Anasayfa, Hakkımda, Hizmetler(+detay), Paketler, Cihazlar(+detay), Blog(+detay), İletişim — hepsi
CMS'ten beslenir.
*Kabul:* tüm sayfalar responsive, AA kontrast, console hatasız (devtools doğrulaması), içerik
Payload'dan geliyor.

**Faz 2 — Randevu sistemi.** Müsaitlik modeli, slot seçici, randevu oluşturma, statüler, admin yönetimi,
çift rezervasyon engeli, iş kuralları (Bölüm 7).
*Kabul:* uçtan uca randevu oluşturulabiliyor, panelde görünüyor, çakışma engelleniyor.

**Faz 3 — Bildirimler.** NotificationService + e-posta → SMS → WhatsApp adaptörleri, 24s hatırlatma
cron'u, KVKK rıza akışları.
*Kabul:* onay + hatırlatma en az e-posta ile çalışır; SMS/WhatsApp adaptörleri config ile aç/kapanır.

**Faz 4 — Online Bilgi Formu + tetkikler.** Çok adımlı form, taslak kaydı, KVKK rızası; tetkikler
sayfası (PDF/yazdır).
*Kabul:* form gönderilebiliyor, panelde danışana bağlanıyor, tetkikler yazdırılabiliyor.

**Faz 5 — SEO + denetim + lansman.** Schema/JSON-LD, sitemap/robots, OG, içerik göçü, performans &
erişilebilirlik denetimi (chrome-devtools-mcp + web design guidelines), domain geçişi.
*Kabul:* Lighthouse mobil ≥ 90, schema doğrulanır, eski domain yeni siteye yönlenir.

**Faz 6 — Sonraki (opsiyonel).** Online ödeme (iyzico/PayTR), danışan portalı, EN dili (i18n),
takvim senkronu (Google Calendar).

---

## 13. Ajan çalışma sözleşmesi (definition of done)

Her sayfa/özellik için:
1. frontend-design ile planla (token → wireframe → öz-eleştiri), sonra kod yaz.
2. Bileşenleri shadcn MCP'den al; özgün parçaları Magic MCP ile üret, token'lara hizala.
3. Türkçe kopyayı bu brief'in ton kurallarına göre yaz.
4. chrome-devtools-mcp ile doğrula: ekran görüntüsü, console temiz, perf trace, mobil+masaüstü,
   klavye/focus. Hataları gidermeden ilerleme.
5. web design guidelines ile denetle, bulguları kapat.
6. Erişilebilirlik + KVKK gereği varsa uygula.

**Kod kalitesi:** TypeScript strict, anlamlı bileşen sınırları, sihirli sabit yok (token kullan),
CSS selector specificity çakışmalarına dikkat (özellikle bölüm padding/margin).

---

## 14. Ortam değişkenleri (.env şablonu)

```
DATABASE_URI=postgres://...
PAYLOAD_SECRET=...
NEXT_PUBLIC_SITE_URL=https://ozdenozgurdurukan.com
RESEND_API_KEY=...
NETGSM_USERNAME=...
NETGSM_PASSWORD=...
NETGSM_HEADER=...
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
TZ=Europe/Istanbul
```

---

## 15. Açık/onay bekleyen varsayımlar

- Domain: mevcut `ozdenozgurdurukan.com` (WordPress) yeni site ile **değiştirilecek**.
- Dil: **TR** birincil; mimari i18n-hazır, EN sonraki fazda.
- Fiyatlar sitede **şeffaf** gösterilecek (CMS'ten düzenlenebilir).
- Yönetilen Postgres sağlayıcısı (Neon / Vercel Postgres / Supabase) seçimi onay bekliyor.
- WhatsApp Business API kurulum süresi nedeniyle lansman, e-posta + SMS ile yapılıp WhatsApp
  sonradan aktive edilebilir.
```
