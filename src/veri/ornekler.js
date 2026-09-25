// Iki animasyonun ornek verisi, modele gore. en: Ingilizce LAVOIR'in gercek
// model ciktilari; tr: LAVOIR-TR (moganai/lavoir-tr) ve Laya-multilingual'in
// ayni SGK konusmasindaki ciktilari (test_seen/sgk_işlemleri/00115/p2/a).
// Olasilik ve VOI dizileri adim sirasiyla: [giris (bos), adim 0, adim 1, adim 2].

const tekduze = (ids) => Object.fromEntries(ids.map((id) => [id, 1 / ids.length]));

// ---- LAVOIR vs Laya (KarsilastirmaAkis) ----
const EN_SECENEK = ['returns_desk', 'refunds', 'logistics', 'marketplace_support', 'warranty_service'];
const TR_SECENEK = ['emeklilik', 'genel_sağlık', 'prim_borç', 'rapor_ödeme', 'işveren_hizmetleri'];

export const KARSILASTIRMA = {
  en: {
    id: 'ecommerce_returns/00017',
    bizAd: 'LAVOIR', layaAd: 'Laya', layaBaslik: 'LAYA',
    secenekler: EN_SECENEK,
    layaP: [tekduze(EN_SECENEK), { refunds: 0.3568, returns_desk: 0.2901, marketplace_support: 0.2197, warranty_service: 0.0688, logistics: 0.0645 }],
    layaGuven: 0.1173,
    layaTahmin: 'refunds',
    bizP: [
      tekduze(EN_SECENEK),
      { returns_desk: 0.35, logistics: 0.2968, marketplace_support: 0.2873, warranty_service: 0.0657, refunds: 0.0001 },
      { returns_desk: 0.4511, logistics: 0.4259, warranty_service: 0.1229, refunds: 0, marketplace_support: 0 },
      { logistics: 1, warranty_service: 0, refunds: 0, returns_desk: 0, marketplace_support: 0 },
    ],
    kazanan: 'logistics',
    sorusuz: 'returns_desk',
    slotlar: [
      { slot: 'problem', q: 'What is the problem with your order?' },
      { slot: 'seller', q: 'Was the item sold by us directly or by a seller on our marketplace?' },
      { slot: 'delivery_age', q: 'When was it delivered: within the last 30 days or earlier?' },
      { slot: 'wants', q: 'Would you prefer a replacement or your money back?' },
      { slot: 'customer_name', q: 'May I have your first name, please?' },
    ],
    slotSutun: 180,
    voi: [
      { problem: 0, seller: 0, delivery_age: 0, wants: 0, customer_name: 0 },
      { seller: 0.1972, problem: 0.1712, delivery_age: 0.0361, wants: 0.0025, customer_name: 0.0013 },
      { seller: 0, problem: 0.3853, delivery_age: 0.0244, wants: 0.0014, customer_name: 0.0007 },
      { seller: 0, delivery_age: 0, wants: 0, problem: 0, customer_name: 0 },
    ],
    soru1: 'seller', soru2: 'problem',
    metin: {
      m0: 'hi, i need help with my recent purchase. i would like a replacement for the item. can you help me with that? thanks',
      q1: 'Was the item sold by us directly or by a seller on our marketplace?',
      a1: 'The item was sold by our store.',
      q2: 'What is the problem with your order?',
      a2: 'The item arrived damaged.',
    },
  },
  tr: {
    id: 'sgk_işlemleri/00115',
    bizAd: 'LAVOIR-TR', layaAd: 'Laya-multilingual', layaBaslik: 'LAYA-MULTI',
    secenekler: TR_SECENEK,
    // Laya-multilingual (mmBERT); guven = 1 - H(p)/log k.
    layaP: [tekduze(TR_SECENEK), { emeklilik: 0.4058, prim_borç: 0.2292, genel_sağlık: 0.1708, işveren_hizmetleri: 0.1242, rapor_ödeme: 0.07 }],
    layaGuven: 0.0986,
    layaTahmin: 'emeklilik',
    bizP: [
      tekduze(TR_SECENEK),
      { emeklilik: 0.2487, rapor_ödeme: 0.2172, genel_sağlık: 0.1982, işveren_hizmetleri: 0.1982, prim_borç: 0.1377 },
      { genel_sağlık: 0.5077, prim_borç: 0.2698, işveren_hizmetleri: 0.2224, emeklilik: 0, rapor_ödeme: 0 },
      { işveren_hizmetleri: 0.9999, genel_sağlık: 0.0001, prim_borç: 0, emeklilik: 0, rapor_ödeme: 0 },
    ],
    kazanan: 'işveren_hizmetleri',
    sorusuz: 'emeklilik',
    slotlar: [
      { slot: 'konu', q: 'Hangi konuda yardım almak istiyorsunuz?' },
      { slot: 'sigortalılık_türü', q: 'Sigortalılık türünüz nedir: SSK (4A), Bağ-Kur (4B) ya da memur (4C)?' },
      { slot: 'başvuran', q: 'Kendi adınıza mı arıyorsunuz, yoksa bir işveren adına mı?' },
      { slot: 'prim_borcu', q: 'Ödenmemiş prim borcunuz var mı?' },
      { slot: 'arayan_adı', q: 'Adınızı öğrenebilir miyim?' },
    ],
    slotSutun: 220,
    voi: [
      { konu: 0, sigortalılık_türü: 0, başvuran: 0, prim_borcu: 0, arayan_adı: 0 },
      { konu: 0.2975, başvuran: 0.1646, prim_borcu: 0.0365, sigortalılık_türü: 0.023, arayan_adı: 0.003 },
      { konu: 0, başvuran: 0.3332, prim_borcu: 0.07, sigortalılık_türü: 0.0103, arayan_adı: 0.0003 },
      { konu: 0, başvuran: 0, prim_borcu: 0.0001, sigortalılık_türü: 0, arayan_adı: 0 },
    ],
    soru1: 'konu', soru2: 'başvuran',
    metin: {
      m0: 'Merhaba, aramamda yardımcı olabilir misiniz?',
      q1: 'Hangi konuda yardım almak istiyorsunuz?',
      a1: 'Sağlık hizmeti konusunda yardım almak istiyorum.',
      q2: 'Kendi adınıza mı arıyorsunuz, yoksa bir işveren adına mı?',
      a2: 'Bir işveren adına arıyorum.',
    },
  },
};

// ---- soru sorma dongusu (DonguAkis) ----
const EN_DONGU_SECENEK = ['technical_support', 'billing', 'sales', 'retention', 'roaming', 'field_technicians'];

export const DONGU = {
  en: {
    secenekler: EN_DONGU_SECENEK,
    p: [
      tekduze(EN_DONGU_SECENEK),
      { sales: 0.2731, billing: 0.2243, field_technicians: 0.1579, retention: 0.1252, technical_support: 0.1238, roaming: 0.0958 },
      { billing: 0.8496, roaming: 0.1504, retention: 0, sales: 0, technical_support: 0, field_technicians: 0 },
      { roaming: 1, billing: 0, technical_support: 0, field_technicians: 0, retention: 0, sales: 0 },
    ],
    slotlar: ['request', 'location', 'service', 'tenure', 'customer_name'],
    voi: [
      { service: 0, request: 0, tenure: 0, location: 0, customer_name: 0 },
      { request: 0.3665, location: 0.0695, service: 0.0543, tenure: 0.007, customer_name: 0.002 },
      { request: 0, location: 0.1849, service: 0.0429, tenure: 0.0051, customer_name: 0.0003 },
      { request: 0, location: 0, service: 0, tenure: 0, customer_name: 0 },
    ],
    // Her dongude sorulan slot, sorusu ve musterinin cevabi.
    sorular: [
      { slot: 'request', voi: 0.366, q: 'What can I help you with today?', a: 'Hi, I have a question about my bill.' },
      { slot: 'location', voi: 0.185, q: 'Are you at home right now or travelling abroad?', a: 'I am currently travelling abroad.' },
    ],
    ilkMesaj: 'Hello, I need some help with something. Please let me know how I can proceed.',
    kazanan: 'roaming',
    kazananP: 1,
    secSutun: 230, slotSutun: 190,
  },
  tr: {
    secenekler: TR_SECENEK,
    p: KARSILASTIRMA.tr.bizP,
    slotlar: ['konu', 'başvuran', 'prim_borcu', 'sigortalılık_türü', 'arayan_adı'],
    voi: KARSILASTIRMA.tr.voi,
    sorular: [
      { slot: 'konu', voi: 0.2975, q: 'Hangi konuda yardım almak istiyorsunuz?', a: 'Sağlık hizmeti konusunda yardım almak istiyorum.' },
      { slot: 'başvuran', voi: 0.3332, q: 'Kendi adınıza mı arıyorsunuz, yoksa bir işveren adına mı?', a: 'Bir işveren adına arıyorum.' },
    ],
    ilkMesaj: 'Merhaba, aramamda yardımcı olabilir misiniz?',
    kazanan: 'işveren_hizmetleri',
    kazananP: 0.9999,
    secSutun: 250, slotSutun: 220,
  },
};
