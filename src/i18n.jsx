import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MODEL_AD, MODEL_AD_TR, LAYA_GITHUB, LAYA_HF, LAVOIR_KOD, LAVOIR_HF } from './sabitler';
import { METIN_TR } from './metin_tr';

// Model adi ve baglantilar sabitler.js'te; bilesenler eskisi gibi buradan alabilir.
export { MODEL_AD, MODEL_AD_TR, LAYA_GITHUB, LAYA_HF };

// Tek kaynak: her metin burada iki dilde durur. Bilesenler literal metin
// tasimaz, yalnizca t.<bolum>.<anahtar> okur. Dizi olarak verilen
// paragraflarda tek indisli parcalar kalin yazilir.
export const METIN = {
  tr: {
    kod: 'tr',
    ondalik: ',',
    modelAd: MODEL_AD,
    navSira: ['giris', 'laya', 'voi', 'veri', 'sonuc', 'kaynak'],
    nav: {
      giris: 'GİRİŞ', moganbert: 'MOGANBERT-TR', laya: 'LAYA', voi: 'VOI', veri: 'VERİ', sonuc: 'SONUÇLAR', kaynak: 'KAYNAKLAR',
    },
    modelSec: {
      et: 'MODEL',
      goruntuleniyor: 'görüntüleniyor',
      gec: 'bu modele geç →',
      kartlar: {
        en: { ad: MODEL_AD, dil: 'İNGİLİZCE', enc: 'ModernBERT-large · 421M', not: 'Makaledeki model: İngilizce iş akışları, gerçek müşteri konuşmaları (SGD, ABCD) ve Laya benchmark’ları.' },
        tr: { ad: MODEL_AD_TR, dil: 'TÜRKÇE', enc: 'MoganBERT-TR · 164M', not: 'Kendi Türkçe encoder’ımız MoganBERT-TR üzerine: 16 Türkçe iş akışı ve Türkçe karar görevleri.' },
      },
    },
    hero: {
      rozet: 'Mogan AI · 2026',
      alt: 'Ne zaman ve ne soracağını bilen karar modeli',
      ozet: ['Laya tipli kararları tek bir ileri geçişte ve kalibre olasılıklarla veriyor; emin olmadığında ise ya yine de karar veriyor ya da konuşmayı insana devrediyor. ',
             MODEL_AD + ' aynı karar mimarisine bir bilgi değeri (VOI) başlığı ekliyor',
             ': model kararsız kaldığında hangi eksik bilgiyi soracağını seçiyor, cevabı alınca yeniden karar veriyor.'],
      yazarlar: 'Yazarlar:',
      grup: 'MoganAI Research Group · Ankara, 2026',
      metaSol: 'SÜRÜM 1 · İNGİLİZCE',
      gercek: [
        { k: 'ENCODER', v: 'ModernBERT-large' },
        { k: 'EKLENEN BAŞLIK', v: 'VOI · ~0,3M parametre' },
        { k: 'SORU SINIRI', v: 'en fazla 2, sonra devret' },
        { k: 'TEMEL', v: 'Laya karar mimarisi' },
      ],
      hfEt: 'MODEL', paperEt: 'MAKALE', kodEt: 'KOD',
      logo: { src: 'lavoir-logo.png', w: 1018, h: 344, gen: 'max-w-[240px] sm:max-w-[280px] md:max-w-[320px]' },
      // Bos birakilan baglanti tiklanamaz ve soluk gorunur.
      baglanti: { hf: LAVOIR_HF, paper: '', kod: LAVOIR_KOD },
    },
    laya: {
      baslik: 'LAYA ÜZERİNE KURULU',
      p1: ['Bu çalışma ', 'Laya', '’nın karar mimarisini ve eğitim hedefini temel alıyor. Laya bir durumu (e-posta, destek bileti, JSON) ve tipli bir soruyu (choice, score, noul) tek bir sekansta kodluyor. Her seçeneğin başındaki [MASK] işaretçisi bir skor üretiyor ve cevap, metin üretilmeden tek geçişte çıkıyor. Olasılıklar kesin uygun (strictly proper) skorlama kurallarıyla eğitildiği için güven değerleri anlamlı.'],
      p2: ['Mimarinin ve eğitimin ayrıntıları için ', 'Laya’nın kendi belgelerine', ' bakabilirsiniz; bu sayfada yalnızca eklediğimiz kısmı anlatıyoruz. Laya’nın yayınlanan ağırlıklarını kullanmadık: encoder ModernBERT-large, karar başlığı sıfırdan eğitildi.'],
      solBaslik: 'LAYA’DAN',
      sol: [
        'Sekans biçimi ve seçenek başına [MASK] işaretçisi',
        'Encoder üstünde iki katmanlı karar başlığı',
        'Yumuşak hedefli çapraz entropi ve uygun skorlama',
        'Soru tipine göre sıcaklık kalibrasyonu',
      ],
      sagBaslik: 'EKLEDİĞİMİZ',
      sag: [
        'Eksik bilgi (slot) bloğu ve slot işaretçileri',
        'Her slot için bilgi değeri tahmin eden, Gini ile sınırlı VOI başlığı',
        'Sor / karar ver / devret için tek bir kural',
        'Gizli profillerden üretilen, kesin posteriorlu eğitim verisi',
      ],
    },
    sorun: {
      baslik: 'SORUN: KARAR VER YA DA DEVRET',
      p: ['Kullanıcı “Bilgilerim izinsiz paylaşılmış, ne yapabilirim?” yazdığında talep veri koruma birimine de hukuk birimine de ait olabilir. Tek geçişli bir karar modelinin bu durumda iki seçeneği var: ',
          'yine de en olası birimi seçmek ya da konuşmayı insana devretmek',
          '. Laya’nın önerdiği kullanım ikincisi: güven eşiğin altındaysa devret. Bu doğruluğu korur, ama her belirsiz konuşmayı insana yükler. Bir insan temsilci ise aynı durumda çoğu zaman tek bir soru sorup işi kendisi çözerdi.'],
      kart: {
        baslik: MODEL_AD + ' VS LAYA',
        alt: 'aynı girdi · ecommerce_returns/00017',
        dipnot: 'Aynı belirsiz ilk mesaj iki modele de veriliyor. Laya’nın güveni 0,12’de kalıyor; önerilen kullanımla (güven < 0,85 → devret) konuşma insan kuyruğuna düşüyor, en iyi tahmini olan refunds da yanlış. ' + MODEL_AD + ' önce satıcıyı, sonra sorunu soruyor ve logistics’e doğru yönlendiriyor; kalan üç soruyu kararı değiştirmeyeceği için sormuyor. Soru sormasaydı returns_desk’i seçecekti.',
        etiket: 'Animasyon: aynı belirsiz mesajda Laya düşük güvenle konuşmayı insana devrediyor, ' + MODEL_AD + ' iki soru sorup doğru birime (logistics) yönlendiriyor.',
      },
      ornek: {
        sahne: { Intro: 'giriş', Step0: 'adım 0', Ask1: 'soru 1', Step1: 'adım 1', Ask2: 'soru 2', Step2: 'adım 2', Result: 'sonuç', Scope: 'fark' },
        m: {
          ayniGirdi: 'aynı girdi', adim: 'adım',
          bizimAlt: 'bizim · karar + VOI başlığı', llmYok: 'döngüde LLM yok',
          layaAlt: 'referans · VOI başlığı yok', kararVeyaDevret: 'karar ver ya da devret',
          konusma: 'konuşma', musteri: 'müşteri', model: 'model',
          slotBaslik: 'slot listesi · sabit sorular', slotBaslikDar: 'slot listesi · VOI',
          slotSag: (c) => `VOI · > ${c} ise sor`, slotSagDar: (c) => `> ${c} ise sor`,
          soruldu: 'soruldu', sorulmadi: 'sorulmadı',
          secenekIlk3: 'seçenekler · ilk 3', secenekler: 'seçenekler', pBirim: 'P(birim)',
          sonuc: 'sonuç', yonOn: 'Yönlendirildi: ',
          lavoirSonucAlt: (d) => `${d.soru} soru soruldu · ${d.atlanan} soru gereksiz olduğu için sorulmadı · soru sormadan ${d.sorusuz} seçilecekti`,
          devredildi: 'devredildi', bekleniyor: 'Bir insanın ya da bir LLM’in devralması bekleniyor…', kuyruk: 'KUYRUK',
          guven: 'güven',
          layaKural: (g, e, tahmin) => `güven ${g} < ${e} → devret · en iyi tahmin ${tahmin} ✗`,
          layaSonuc: 'İnsana devredildi',
          layaSonucAlt: (g, e, y, tahmin) => `güven ${g} < ${e} · en iyi tahmin: ${tahmin} (${y}) `,
          fark: 'fark', farkBaslik: (ad) => `Emin olmadığında ${ad} eksik bilgiyi kendisi topluyor.`,
          akis: [
            { label: 'müşteri', title: 'Mesaj', sub: 'belirsiz ilk mesaj' },
            { label: 'bu model', title: 'Sor · dur · yönlendir', sub: 'hangi soruyu soracağını ve ne zaman duracağını seçer' },
            { label: 'yönlendirilen birim', title: 'Sorunu çöz', sub: 'insan ya da LLM, sonraki adım' },
          ],
          maddeler: [
            { n: '01', title: 'LLM gerekmiyor', text: 'Soru metinleri iş akışının slot listesinde önceden tanımlı.' },
            { n: '02', title: 'Gereksiz soru yok', text: 'Müşterinin zaten söylediğini ya da kararı değiştirmeyecek olanı sormaz.' },
            { n: 'sınır', title: 'Yalnızca tanımlı sorular', text: 'Bunlar arasından seçer; serbest soru yazmaz.' },
          ],
        },
      },
    },
    voi: {
      baslik: 'VOI BAŞLIĞI',
      p1: ['Sekansa ikinci bir blok ekliyoruz: sorulabilecek eksik bilgiler (slotlar), yine [MASK] işaretçileriyle. Her slot işaretçisinin gizli durumu küçük bir başlıktan geçiyor ve tek bir sayı üretiyor: ',
           'bu bilgi sorulursa doğru birimin olasılığı ortalamada ne kadar artar',
           '. Karar dağılımı ve her slotun bilgi değeri aynı ileri geçişte çıkıyor.'],
      sekansBaslik: 'SEKANS BİÇİMİ',
      sekansAlt: 'tek ileri geçiş · iki işaretçi bloğu',
      sekans: [
        { m: '[CLS]', t: 'sabit' }, { m: 'Bu talebi hangi birim ele almalı?', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: '[MASK]', t: 'secenek' }, { m: 'veri koruma', t: 'metin' },
        { m: '[MASK]', t: 'secenek' }, { m: 'hukuk', t: 'metin' },
        { m: '[MASK]', t: 'secenek' }, { m: 'destek', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: 'eksik bilgi:', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'veri türü', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'talep', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'sözleşme', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: 'Bilgilerim izinsiz paylaşılmış…', t: 'mesaj' }, { m: '[SEP]', t: 'sabit' },
      ],
      lejant: { secenek: 'seçenek işaretçisi → karar olasılığı', slot: 'slot işaretçisi → bilgi değeri (VOI)', mesaj: 'kullanıcı mesajı ve önceki soru–cevaplar' },
      kuralBaslik: 'KARAR KURALI',
      kuralAlt: 'üç aksiyon · tek kural',
      kural: [
        ['k = argmax(voi)', '# henüz sorulmamış slotlar arasında'],
        ['if voi[k] > c_ask:', 'ask(k)'],
        ['elif 1 − max(p) > c_handoff:', 'hand_off()'],
        ['else:', 'decide(argmax(p))'],
      ],
      kuralDipnot: 'Soru sorulunca cevap mesaja ekleniyor ve model sekansı baştan kodluyor. En fazla iki sorudan sonra hâlâ emin değilse konuşmayı insana devrediyor.',
      pGini: ['Bilgi değerinin bir üst sınırı var: bir sorunun doğru birimin olasılığını artırabileceği miktar, karar dağılımının ',
              'Gini katsayısını (1 − Σp²)',
              ' aşamaz. VOI başlığının çıkışı bu sınırla çarpılıyor; model eminken bilgi değeri yapısal olarak sıfıra iniyor ve soru sorulmuyor. Bu sınır olmadan model, eğitimde görmediği konuşmalarda neredeyse her seferinde soru sormak istiyordu.'],
      kart: {
        baslik: 'VOI BAŞLIĞI NE ZAMAN DEVREYE GİRER?',
        alt: 'soru sorma döngüsü · telecom_support/00118',
        dipnot: 'Her ileri geçişte model, karar olasılıklarıyla birlikte henüz sorulmamış her slotun bilgi değerini (VOI) hesaplıyor; bunun için ek bir model çağrısı yok. En yüksek VOI eşiği (c = 0,05) geçerse o slotun sabit sorusu gönderiliyor, cevap konuşmaya eklenip model baştan çalışıyor. Hiçbir slot eşiği geçmediğinde ya da iki soru hakkı dolduğunda döngü bitiyor: model karar veriyor, hâlâ emin değilse konuşmayı insana devrediyor.',
        etiket: 'Animasyon: soru sorma döngüsü. Model iki kez döngüye girip request ve location slotlarını soruyor, üçüncü geçişte hiçbir slotun değeri eşiği geçmediği için döngüden çıkıp roaming kararını veriyor.',
      },
      ornek: {
        sahne: { Intro: 'giriş', Loop0: 'döngü 0', Loop1: 'döngü 1', Loop2: 'döngü 2', Ozet: 'özet' },
        // Animasyon ici metinler (modelin kendi girdi/ciktilari Ingilizce kalir).
        m: {
          baslik: 'VOI başlığı ne zaman devreye girer?',
          dongu: 'döngü', sorular: 'sorular', hazir: 'hazır',
          donguPanel: 'döngü · model içinde çalışır', donguPanelDar: 'döngü · model içinde',
          cikis: (c, b) => `çıkış · VOI ≤ ${c} ya da ${b} soru soruldu`,
          cikisDar: (c, b) => `çıkış · VOI ≤ ${c} ya da ${b} soru`,
          mesaj: 'mesaj', model: 'model', slotuSor: 'slotu sor', kararVer: 'karar ver', devret: 'devret',
          ilkMesaj: 'ilk mesaj', cevapEklendi: 'cevap eklendi', tekGecis: 'p + VOI · tek geçiş',
          esik: (c) => `eşik c = ${c}`, evetK: 'evet', hayirK: 'hayır', EVET: 'EVET', HAYIR: 'HAYIR',
          sabitSoru: 'sabit soru', haalaEmin: 'hâlâ emin değil mi?', insana: 'insana',
          donus: 'soruyu gönder → cevabı bekle → yeniden çalıştır', donusDar: 'sor → bekle → yeniden',
          konusma: 'konuşma', musteri: 'müşteri', pIlk3: 'p(birim) · ilk 3', slotVoi: 'slot başına VOI', soruldu: 'soruldu',
          ozetEt: 'VOI başlığı',
          ozetBaslik: 'Her geçişte çalışır. Yalnızca bir soru buna değdiğinde devreye girer.',
          madde: (c, b) => [
            { n: '01 · her geçiş', baslik: 'Kararla birlikte hesaplanır', metin: 'Her ileri geçiş p’yi ve henüz sorulmamış her slotun VOI’sini birlikte verir. Ek model çağrısı yok.' },
            { n: `02 · max VOI > ${c}`, baslik: 'Sor, sonra yeniden çalıştır', metin: 'Slotun sabit sorusu gönderilir; cevap konuşmaya eklenir ve model tüm konuşma üzerinde yeniden çalışır.' },
            { n: `03 · VOI ≤ ${c} ya da ${b} soru`, baslik: 'Döngüden çık', metin: 'argmax p ile karar verir; model hâlâ emin değilse konuşmayı insana devreder.' },
          ],
        },
      },
      p2: ['Açıklayıcı soruları beklenen bilgi değeriyle sıralama fikri yeni değil (Rao ve Daumé III, 2018). Oradaki yöntem her aday soruyu ve olası cevaplarını ayrı ayrı üretip skorluyordu. Burada bilgi değeri ',
           'amortize',
           ' ediliyor: olası cevapları tek tek denemek yerine model beklentiyi doğrudan tahmin ediyor, üretim adımı yok.'],
    },
    veri: {
      baslik: 'EĞİTİM VERİSİ: GİZLİ PROFİLLER',
      p1: 'Her iş akışı bir şema olarak tanımlı: birimler, slotlar ve “şu değerler → şu birim” kuralları. Doğru cevap bir dil modelinden değil kuraldan geliyor; dil modeli yalnızca kullanıcının mesajını ve cevaplarını yazıyor. Ayrı bir model ailesi, mesajın gizli kalması gereken bilgiyi ele verip vermediğini denetliyor.',
      hatBaslik: 'BİR ÖRNEĞİN ÜRETİMİ',
      hatAlt: 'profil → mesaj → soru–cevap',
      hat: [
        { et: '01 · GİZLİ PROFİL', v: 'veri türü: sağlık\ntalep: silme\nsözleşme: yok', not: 'kural → veri koruma' },
        { et: '02 · EKSİK MESAJ', v: '“Bilgilerim izinsiz paylaşılmış, ne yapabilirim?”', not: 'yalnızca bazı slotlar açık' },
        { et: '03 · SORU–CEVAP', v: '“Paylaşılan bilgi ne türdü?”\n“Sağlık raporum.”', not: 'cevap profilden' },
      ],
      p2: ['Profiller bilinen bir önsel dağılımdan örneklendiği için her belirsiz durumda birimlerin olasılığı ',
           'tam olarak',
           ' hesaplanabiliyor. Model tek sıcak etiket yerine bu posteriora göre eğitiliyor. Aynı hesap her slotun gerçek bilgi değerini de verdiği için VOI başlığı kesin bir referansa (oracle) karşı ölçülebiliyor.'],
      p3: ['Karar başlığı yalnızca bu şemalarla eğitilmedi. ',
           '40’tan fazla kaynaktan yaklaşık 82 bin tek turlu örnek',
           ' de eğitime girdi: typed-decisions, Laya’nın eğitimde kullandığı açık kaynaklar (AG News, Enron spam, phishing, MS MARCO, BoolQ, destek biletleri), 27 açık veri seti ve soru biçimli evet/hayır örnekleri. Laya’nın benchmark’larında kullanılan metinler eğitim verisinden çıkarıldı.'],
      kunye: (k) => [
        { k: 'ŞEMA', v: `${k.sema.egitim} eğitim · ${k.sema.gorulmemis} görülmemiş` },
        { k: 'VOI ÖRNEKLERİ', v: `${(k.ornek.egitim / 1000).toFixed(1).replace('.', ',')}k eğitim · ${(k.ornek.test / 1000).toFixed(1).replace('.', ',')}k test` },
        { k: 'GENEL KARAR VERİSİ', v: `~${k.genel / 1000}k · ${k.kaynak}+ kaynak` },
        { k: 'TOPLAM', v: `~${k.toplam / 1000}k eğitim örneği` },
      ],
    },
    sonuc: {
      baslik: 'SONUÇLAR',
      p1: 'Model üç düzeyde değerlendirildi: kesin bilgi değerinin hesaplanabildiği kendi iş akışlarımız, eğitimde hiç görülmemiş gerçek müşteri konuşmaları (SGD ve ABCD) ve tek turlu karar için Laya’nın kendi benchmark’ları.',
      // d: sonuclar.js'ten bicimlenmis degerler (Sonuc.jsx hesaplar)
      ozet: (d) => [
        { v: d.auc, k: 'diyalog AUC', not: `görülmüş iş akışlarında; oracle ${d.oracle}` },
        { v: d.soru, k: 'soru isteme · SGD', not: 'Gini sınırı, model eminken sormayı kesiyor' },
        { v: d.kazanc, k: 'puan · ABCD', not: 'modelin sorduğu konuşmalarda tek soru–cevaptan sonra' },
        { v: d.bench, k: 'Laya benchmark’ı', not: 'Laya’nın üstünde, spam’de eşit' },
      ],
      thOlcut: 'ÖLÇÜT', thGoruldu: 'GÖRÜLMÜŞ İŞ AKIŞI', thGorulmedi: 'GÖRÜLMEMİŞ İŞ AKIŞI',
      sentBaslik: 'BİZİM İŞ AKIŞLARIMIZ',
      sentAlt: 'sentetik test · kesin oracle ile',
      sent: [
        { k: 'auc', ad: 'Diyalog AUC (0–2 soru)' },
        { k: 'b05', ad: 'Doğruluk · konuşma başına ≤0,5 soru' },
        { k: 'rho', ad: 'VOI ↔ oracle (Spearman)' },
        { k: 'top1', ad: 'En değerli slotta uyum' },
      ],
      sentDipnot: (f) => `AUC, soru eşiği taranırken doğruluk–soru sayısı eğrisinin altındaki normalize alan. Görülmüş iş akışlarında gerçek bilgi değerini bilen oracle politikasının AUC’si ${f.oracle}. Soru sormadan tek tur doğruluk ${f.acc}, Bayes tavanı ${f.tavan}, ECE ${f.ece}: model tavana oturuyor, metinden gizli bilgi sızmıyor.`,
      p2: ['Görülmüş iş akışlarında ', MODEL_AD + ' soruları oracle kadar iyi seçiyor', ' ve soru sormadan verdiği kararda Bayes tavanına oturuyor. Görülmemiş dört iş akışında VOI sıralaması hâlâ anlamlı, ama karar kısmı tavanın belirgin şekilde altında kalıyor: sekiz eğitim şemasından yeni iş akışlarının kurallarına genellemek bu sürümün zayıf noktası.'],
      polBaslik: 'SORU SORMA POLİTİKALARI',
      polAlt: 'ilk değerlendirme turu · aynı test seti',
      thPol: 'POLİTİKA', thAuc: 'AUC', thB05: '≤0,5 SORU',
      pol: {
        b2: 'Hiç sormaz',
        b3: 'Emin değilse rastgele slot sorar',
        b5: 'Olasılık kümesi > 1 ise sorar',
        voi: MODEL_AD + ' (VOI)',
        oracle: 'Kesin VOI (açgözlü oracle)',
      },
      polDipnot: 'Bu karşılaştırma ilk değerlendirme turunda (önceki checkpoint, Gini sınırı yok) aynı test setiyle yapıldı; ana model için baseline’lar ayrıca koşulmadı, VOI satırı bu yüzden yukarıdaki tablodan biraz farklı. Kalın değer, oracle hariç sütunun en iyisi. — ölçülmedi.',
      // b2, b3: <=0,5 soru butcesinde VOI'nin farki (puan)
      p3: (b2, b3) => ['Aynı karar modeliyle farklı soru kuralları karşılaştırıldığında ', 'hangi slotun sorulacağını VOI ile seçmek belirleyici oluyor', `: konuşma başına yarım sorudan az bir bütçede VOI politikası, hiç sormayan modele göre ${b2}, rastgele slot soran modele göre ${b3} puan daha doğru.`],
      gercekBaslik: 'GERÇEK KONUŞMALAR',
      gercekAlt: 'SGD ve ABCD · ikisi de eğitimde yok',
      thSgd: 'SGD', thAbcd: 'ABCD',
      gercek: [
        { k: 'acc', ad: 'İlk mesajda doğruluk' },
        { k: 'gorulmemis', ad: 'Görülmemiş servislerde doğruluk' },
        { k: 'ece', ad: 'ECE (düşük iyi)' },
        { k: 'soru', ad: 'Soru isteme oranı · Gini sınırsız → sınırlı' },
        { k: 'auroc', ad: 'AUROC(VOI → hata) · sınırsız → sınırlı' },
        { k: 'kazanc', ad: 'Tek soru–cevaptan sonra kazanç · sorduğu / sormadığı' },
      ],
      gercekDipnot: 'SGD: 3.812 ilk kullanıcı turu, 20 servis, bunların 2.766’sı eğitimde hiç görülmemiş servislerden. ABCD: 918 müşteri hizmetleri diyaloğu, 10 akış; kazanç, temsilcinin gerçek ilk cevabı ve müşterinin gerçek ikinci mesajı eklenerek ölçüldü. Soru oranları c = 0,02 eşiğinde; “sınırsız” aynı modelin Gini sınırı olmayan sürümü.',
      p4: ['Gerçek konuşmalarda iki sonuç öne çıkıyor. Birincisi, ', 'Gini sınırı gereksiz soruları neredeyse tamamen kesiyor', ': SGD’de doğruluk zaten yüksekken sınırsız model hemen her konuşmada soru sormak istiyordu. İkincisi, ABCD’de soru kararı gerçekten bilgi değerini izliyor: kazancın tamamı modelin sormayı seçtiği konuşmalarda, sormadığı konuşmalarda cevap kararı değiştirmiyor. Zayıf nokta kalibrasyon: ABCD dağılım dışında ve model orada aşırı emin (güveni 0,99’un üstündeyken %19 yanılıyor); emin olduğu için bu konuşmalarda soru da sormuyor.'],
      benchBaslik: 'LAYA BENCHMARK’LARI',
      benchAlt: 'tek turlu karar · Laya’nın kendi test kodu',
      thSet: 'VERİ SETİ', thBiz: MODEL_AD, thLaya: 'LAYA', thJev: 'JEV',
      set: {
        typed: 'typed-decisions (2.000 karar)', massive: 'MASSIVE-en niyet (20 seçenek)', banking: 'Banking77 (77 etiket)',
        jailbreak: 'Jailbreak tespiti', routing: 'Model yönlendirme', toxic: 'Toksisite', rag: 'RAG pasaj alakası',
        spam: 'E-posta spam', phishing: 'Phishing', ag: 'AG News', emotion: 'DAIR Emotion', triage: 'Destek triajı (10 kuyruk)',
      },
      benchDipnot: (ms) => `Laya’nın bench_apps kodu olduğu gibi kullanıldı (seed 13, set başına 400 vaka). Laya sütunu, Laya’nın yayınladığı en iyi checkpoint sonucu; Jev sütunu yayınlanmış sonuçlar (Jev’in Banking77 sonucu 72 etiketle). Laya’nın eğitimde gördüğü kaynakların bir kısmı (AG News, Enron spam, phishing, MS MARCO, destek biletleri) bizim eğitim verisinde de var; benchmark metinleri eğitim verisinden çıkarıldı. Tek soru gecikmesi p50 ${ms} ms (GH200; Laya’nın yayınladığı 33–40 ms T4’te, donanımlar farklı).`,
      p5: ['Tek turlu kararda ', MODEL_AD + ', on iki setin yedisinde Laya’nın üstünde, spam’de eşit', '. Geride kaldığı dört set (AG News, phishing, Emotion ve destek triajı) Laya’nın daha geniş ve yayınlanmamış eğitim karışımının öne çıktığı alanlar. Soru sorma yeteneği tek turlu kararı zayıflatmadı.'],
    },
    sinir: {
      baslik: 'SINIRLILIKLAR',
      liste: [
        'Sorulabilecek bilgiler iş akışı başına önceden tanımlı; listede olmayan bir eksik bilgi sorulamaz.',
        'Bilgi değeri tek adımlık hesaplanıyor; sorular sırayla ve açgözlü seçiliyor.',
        'Görülmemiş iş akışlarında karar kısmı Bayes tavanının belirgin şekilde altında; sekiz eğitim şeması yeni kurallara genellemek için az.',
        'Dağılım dışı konuşmalarda model aşırı emin olabiliyor (ABCD’de ECE 0,19); emin olduğu için bu konuşmalarda soru da sormuyor.',
        'Soru metinleri şablondan geliyor; soruyu doğal dille yazmak bu sürümün kapsamı dışında.',
        'Model yalnızca İngilizce. Gerçek kullanıcılarla etkileşimli değerlendirme henüz yapılmadı; ABCD’deki soru–cevaplar kayıtlı konuşmalardan.',
      ],
    },
    kaynak: {
      baslik: 'KAYNAKLAR',
      liste: [
        { ad: 'Laya: typed decisions in a single forward pass', not: 'karar mimarisi ve eğitim hedefi', url: LAYA_GITHUB },
        { ad: 'Laya checkpoint’leri (Hugging Face)', not: 'karşılaştırma için', url: LAYA_HF },
        { ad: 'Rao ve Daumé III (2018). Learning to Ask Good Questions', not: 'EVPI ile açıklayıcı soru sıralama', url: 'https://aclanthology.org/P18-1255/' },
        { ad: 'ModernBERT', not: 'encoder', url: 'https://huggingface.co/answerdotai/ModernBERT-large' },
        { ad: 'Schema-Guided Dialogue (SGD)', not: 'genel karar verisi ve gerçek konuşma testi', url: 'https://github.com/google-research-datasets/dstc8-schema-guided-dialogue' },
        { ad: 'Action-Based Conversations Dataset (ABCD)', not: 'gerçek müşteri konuşmaları testi', url: 'https://github.com/asappresearch/abcd' },
      ],
      atifBaslik: 'ATIF',
      atif: '@misc{mogan2026lavoir,\n  title  = {' + MODEL_AD + ': Knowing When and What to Ask in a Single Forward Pass},\n  author = {Yılmaz, Furkan and Taşdemir, Habibe Aleyna and Gözay, Muhammed Faruk},\n  year   = {2026},\n  note   = {yakında}\n}',
    },
    anim: { oynat: 'Oynat', duraklat: 'Duraklat' },
    footer: { lisans: '© 2026 MoganAI Research Group. Apache 2.0.' },
  },

  en: {
    kod: 'en',
    ondalik: '.',
    modelAd: MODEL_AD,
    navSira: ['giris', 'laya', 'voi', 'veri', 'sonuc', 'kaynak'],
    nav: {
      giris: 'HOME', moganbert: 'MOGANBERT-TR', laya: 'LAYA', voi: 'VOI', veri: 'DATA', sonuc: 'RESULTS', kaynak: 'REFERENCES',
    },
    modelSec: {
      et: 'MODEL',
      goruntuleniyor: 'viewing',
      gec: 'switch to this model →',
      kartlar: {
        en: { ad: MODEL_AD, dil: 'ENGLISH', enc: 'ModernBERT-large · 421M', not: 'The model in the paper: English workflows, real customer conversations (SGD, ABCD) and Laya’s benchmarks.' },
        tr: { ad: MODEL_AD_TR, dil: 'TURKISH', enc: 'MoganBERT-TR · 164M', not: 'Built on MoganBERT-TR, our own Turkish encoder: 16 Turkish workflows and Turkish decision tasks.' },
      },
    },
    hero: {
      rozet: 'Mogan AI · 2026',
      alt: 'A decision model that knows when and what to ask',
      ozet: ['Laya makes typed decisions in a single forward pass with calibrated probabilities; when it is unsure, it either decides anyway or hands the conversation to a human. ',
             MODEL_AD + ' adds a value-of-information (VOI) head to the same decision architecture',
             ': when the model is undecided it picks which missing piece of information to ask for, and decides again once it has the answer.'],
      yazarlar: 'Authors:',
      grup: 'MoganAI Research Group · Ankara, 2026',
      metaSol: 'VERSION 1 · ENGLISH',
      gercek: [
        { k: 'ENCODER', v: 'ModernBERT-large' },
        { k: 'ADDED HEAD', v: 'VOI · ~0.3M parameters' },
        { k: 'QUESTION LIMIT', v: 'at most 2, then hand off' },
        { k: 'FOUNDATION', v: 'Laya decision architecture' },
      ],
      hfEt: 'MODEL', paperEt: 'PAPER', kodEt: 'CODE',
      logo: { src: 'lavoir-logo.png', w: 1018, h: 344, gen: 'max-w-[240px] sm:max-w-[280px] md:max-w-[320px]' },
      // Bos birakilan baglanti tiklanamaz ve soluk gorunur.
      baglanti: { hf: LAVOIR_HF, paper: '', kod: LAVOIR_KOD },
    },
    laya: {
      baslik: 'BUILT ON LAYA',
      p1: ['This work builds on the decision architecture and training objective of ', 'Laya', '. Laya encodes a state (an e-mail, a support ticket, a JSON document) and a typed question (choice, score, noul) as a single sequence. A [MASK] marker in front of each option produces a score, and the answer comes out of one forward pass without generating any text. Because the probabilities are trained with strictly proper scoring rules, the confidence values mean something.'],
      p2: ['For the details of the architecture and training see ', 'Laya’s own documentation', '; this page only covers what we added. We did not use Laya’s released weights: the encoder is ModernBERT-large and the decision head was trained from scratch.'],
      solBaslik: 'FROM LAYA',
      sol: [
        'Sequence format with a [MASK] marker per option',
        'Two-layer decision head on top of the encoder',
        'Soft-target cross-entropy and proper scoring',
        'Temperature calibration per question type',
      ],
      sagBaslik: 'WHAT WE ADDED',
      sag: [
        'A missing-information (slot) block with slot markers',
        'A Gini-bounded VOI head that estimates the value of each slot',
        'One rule for ask / decide / hand off',
        'Training data from hidden profiles, with exact posteriors',
      ],
    },
    sorun: {
      baslik: 'THE PROBLEM: DECIDE OR HAND OFF',
      p: ['When a user writes “My information was shared without my consent, what can I do?”, the request could belong to the privacy team or to legal. A single-pass decision model has two options here: ',
          'pick the most likely team anyway, or hand the conversation to a human',
          '. Laya recommends the second: hand off when confidence is below a threshold. That protects accuracy, but it puts every ambiguous conversation on a person. A human agent in the same spot would usually ask one question and resolve it themselves.'],
      kart: {
        baslik: MODEL_AD + ' VS LAYA',
        alt: 'same input · ecommerce_returns/00017',
        dipnot: 'The same ambiguous first message goes to both models. Laya’s confidence stays at 0.12; with the recommended usage (confidence < 0.85 → hand off) the conversation lands in the human queue, and its best guess, refunds, is wrong anyway. ' + MODEL_AD + ' asks about the seller, then about the problem, and routes correctly to logistics; it skips the other three questions because they would not change the decision. Without asking it would have picked returns_desk.',
        etiket: 'Animation: on the same ambiguous message Laya hands off with low confidence, while ' + MODEL_AD + ' asks two questions and routes to the right team (logistics).',
      },
      ornek: {
        sahne: { Intro: 'intro', Step0: 'step 0', Ask1: 'question 1', Step1: 'step 1', Ask2: 'question 2', Step2: 'step 2', Result: 'result', Scope: 'difference' },
        m: {
          ayniGirdi: 'same input', adim: 'step',
          bizimAlt: 'ours · decision + VOI head', llmYok: 'no LLM in the loop',
          layaAlt: 'baseline · no VOI head', kararVeyaDevret: 'decide or hand off',
          konusma: 'conversation', musteri: 'customer', model: 'model',
          slotBaslik: 'slot list · predefined questions', slotBaslikDar: 'slot list · VOI',
          slotSag: (c) => `VOI · ask if > ${c}`, slotSagDar: (c) => `ask if > ${c}`,
          soruldu: 'asked', sorulmadi: 'not asked',
          secenekIlk3: 'options · top 3', secenekler: 'options', pBirim: 'P(team)',
          sonuc: 'result', yonOn: 'Routed to ',
          lavoirSonucAlt: (d) => `${d.soru} questions asked · ${d.atlanan} skipped as unnecessary · without asking it would have picked ${d.sorusuz}`,
          devredildi: 'handed off', bekleniyor: 'Waiting for a human or an LLM to pick up…', kuyruk: 'QUEUE',
          guven: 'confidence',
          layaKural: (g, e, tahmin) => `conf ${g} < ${e} → hand off · top guess ${tahmin} ✗`,
          layaSonuc: 'Handed off to a human',
          layaSonucAlt: (g, e, y, tahmin) => `confidence ${g} < ${e} · best guess: ${tahmin} (${y}) `,
          fark: 'the difference', farkBaslik: (ad) => `When unsure, ${ad} gathers the missing information itself.`,
          akis: [
            { label: 'customer', title: 'Message', sub: 'vague first message' },
            { label: 'this model', title: 'Ask · stop · route', sub: 'picks which question, and when to stop' },
            { label: 'routed team', title: 'Solve the issue', sub: 'human or LLM, next step' },
          ],
          maddeler: [
            { n: '01', title: 'No LLM needed', text: 'Question texts are predefined in the workflow’s slot list.' },
            { n: '02', title: 'No redundant questions', text: 'Skips what the customer already said or what wouldn’t change the decision.' },
            { n: 'limit', title: 'Defined questions only', text: 'It chooses among them; it does not write free-form questions.' },
          ],
        },
      },
    },
    voi: {
      baslik: 'THE VOI HEAD',
      p1: ['We add a second block to the sequence: the pieces of information that could be asked for (slots), again with [MASK] markers. The hidden state at each slot marker goes through a small head that outputs a single number: ',
           'if this were asked, how much would the probability of the correct team rise on average',
           '. The decision distribution and the value of every slot come out of the same forward pass.'],
      sekansBaslik: 'SEQUENCE FORMAT',
      sekansAlt: 'one forward pass · two marker blocks',
      sekans: [
        { m: '[CLS]', t: 'sabit' }, { m: 'Which team should handle this request?', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: '[MASK]', t: 'secenek' }, { m: 'privacy', t: 'metin' },
        { m: '[MASK]', t: 'secenek' }, { m: 'legal', t: 'metin' },
        { m: '[MASK]', t: 'secenek' }, { m: 'support', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: 'missing information:', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'data type', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'request', t: 'metin' },
        { m: '[MASK]', t: 'slot' }, { m: 'contract', t: 'metin' }, { m: '[SEP]', t: 'sabit' },
        { m: 'My information was shared…', t: 'mesaj' }, { m: '[SEP]', t: 'sabit' },
      ],
      lejant: { secenek: 'option marker → decision probability', slot: 'slot marker → value of information', mesaj: 'user message and earlier questions and answers' },
      kuralBaslik: 'DECISION RULE',
      kuralAlt: 'three actions · one rule',
      kural: [
        ['k = argmax(voi)', '# among slots not yet asked'],
        ['if voi[k] > c_ask:', 'ask(k)'],
        ['elif 1 − max(p) > c_handoff:', 'hand_off()'],
        ['else:', 'decide(argmax(p))'],
      ],
      kuralDipnot: 'After a question the answer is appended to the message and the model re-encodes the sequence. If it is still unsure after at most two questions it hands the conversation to a human.',
      pGini: ['The value of information has an upper bound: the amount by which a question can raise the probability of the correct team cannot exceed the ',
              'Gini impurity of the decision distribution (1 − Σp²)',
              '. The VOI head’s output is multiplied by this bound, so when the model is confident the value of information drops to zero by construction and no question is asked. Without the bound the model wanted to ask in almost every conversation it had not seen in training.'],
      kart: {
        baslik: 'WHEN DOES THE VOI HEAD ACT?',
        alt: 'the asking loop · telecom_support/00118',
        dipnot: 'On every forward pass the model computes, together with the decision probabilities, the value of information (VOI) of every slot not asked yet; there is no extra model call. If the highest VOI clears the threshold (c = 0.05), that slot’s fixed question is sent, the answer is appended to the conversation and the model runs again. The loop ends when no slot clears the threshold or the two-question budget is used: the model decides, or hands the conversation to a human if it is still unsure.',
        etiket: 'Animation: the asking loop. The model loops twice, asking the request and location slots; on the third pass no slot clears the threshold, so it exits the loop and decides roaming.',
      },
      ornek: {
        sahne: { Intro: 'intro', Loop0: 'loop 0', Loop1: 'loop 1', Loop2: 'loop 2', Ozet: 'summary' },
        m: {
          baslik: 'When does the VOI head act?',
          dongu: 'loop', sorular: 'questions', hazir: 'ready',
          donguPanel: 'loop · runs inside the model', donguPanelDar: 'loop · inside the model',
          cikis: (c, b) => `exit · VOI ≤ ${c}, or ${b} questions asked`,
          cikisDar: (c, b) => `exit · VOI ≤ ${c} or ${b} asked`,
          mesaj: 'message', model: 'model', slotuSor: 'ask slot', kararVer: 'decide', devret: 'hand off',
          ilkMesaj: 'first message', cevapEklendi: 'answer added', tekGecis: 'p + VOI · one pass',
          esik: (c) => `max VOI vs c = ${c}`, evetK: 'yes', hayirK: 'no', EVET: 'YES', HAYIR: 'NO',
          sabitSoru: 'fixed question', haalaEmin: 'still unsure?', insana: 'to a human',
          donus: 'send question → wait for answer → re-run', donusDar: 'send → wait → re-run',
          konusma: 'conversation', musteri: 'customer', pIlk3: 'p(team) · top 3', slotVoi: 'VOI per slot', soruldu: 'asked',
          ozetEt: 'the VOI head',
          ozetBaslik: 'Runs on every pass. Acts only when a question is worth it.',
          madde: (c, b) => [
            { n: '01 · every pass', baslik: 'Scored with the decision', metin: 'Each forward pass returns p and the VOI of every slot not asked yet. No extra model call.' },
            { n: `02 · max VOI > ${c}`, baslik: 'Ask, then re-run', metin: 'The slot’s fixed question is sent; the answer is appended and the model runs again on the whole conversation.' },
            { n: `03 · VOI ≤ ${c} or ${b} asked`, baslik: 'Exit the loop', metin: 'Decide on argmax p, or hand off to a human if the model is still unsure.' },
          ],
        },
      },
      p2: ['Ranking clarifying questions by expected value of information is not new (Rao and Daumé III, 2018). That method generated each candidate question and its possible answers and scored them one by one. Here the value of information is ',
           'amortized',
           ': instead of trying out possible answers, the model predicts the expectation directly, with no generation step.'],
    },
    veri: {
      baslik: 'TRAINING DATA: HIDDEN PROFILES',
      p1: 'Each workflow is defined as a schema: teams, slots and “these values → this team” rules. The correct answer comes from the rule, not from a language model; the language model only writes the user’s message and replies. A model from a different family checks whether a message gives away information that should stay hidden.',
      hatBaslik: 'HOW ONE EXAMPLE IS MADE',
      hatAlt: 'profile → message → question and answer',
      hat: [
        { et: '01 · HIDDEN PROFILE', v: 'data type: health\nrequest: delete\ncontract: none', not: 'rule → privacy' },
        { et: '02 · INCOMPLETE MESSAGE', v: '“My information was shared without my consent, what can I do?”', not: 'only some slots are stated' },
        { et: '03 · QUESTION AND ANSWER', v: '“What kind of information was shared?”\n“My medical report.”', not: 'answer from the profile' },
      ],
      p2: ['Because profiles are sampled from a known prior, the probability of each team in any ambiguous state can be computed ',
           'exactly',
           '. The model is trained on this posterior rather than a one-hot label. The same computation gives the true value of every slot, so the VOI head can be measured against an exact reference (oracle).'],
      p3: ['The decision head was not trained on these schemas alone. ',
           'About 82k single-turn examples from more than 40 sources',
           ' went into training as well: typed-decisions, the open sources Laya used in training (AG News, Enron spam, phishing, MS MARCO, BoolQ, support tickets), 27 open datasets and question-form yes/no examples. Texts used in Laya’s benchmarks were removed from the training data.'],
      kunye: (k) => [
        { k: 'SCHEMAS', v: `${k.sema.egitim} training · ${k.sema.gorulmemis} unseen` },
        { k: 'VOI EXAMPLES', v: `${(k.ornek.egitim / 1000).toFixed(1)}k train · ${(k.ornek.test / 1000).toFixed(1)}k test` },
        { k: 'GENERAL DECISION DATA', v: `~${k.genel / 1000}k · ${k.kaynak}+ sources` },
        { k: 'TOTAL', v: `~${k.toplam / 1000}k training examples` },
      ],
    },
    sonuc: {
      baslik: 'RESULTS',
      p1: 'The model was evaluated at three levels: our own workflows, where the exact value of information can be computed; real customer conversations never seen in training (SGD and ABCD); and Laya’s own benchmarks for single-turn decisions.',
      ozet: (d) => [
        { v: d.auc, k: 'dialogue AUC', not: `on seen workflows; oracle ${d.oracle}` },
        { v: d.soru, k: 'asking rate · SGD', not: 'the Gini bound stops questions when the model is confident' },
        { v: d.kazanc, k: 'points · ABCD', not: 'in conversations where the model chose to ask, after one question and answer' },
        { v: d.bench, k: 'Laya benchmarks', not: 'above Laya, tied on spam' },
      ],
      thOlcut: 'METRIC', thGoruldu: 'SEEN WORKFLOWS', thGorulmedi: 'UNSEEN WORKFLOWS',
      sentBaslik: 'OUR WORKFLOWS',
      sentAlt: 'synthetic test · with an exact oracle',
      sent: [
        { k: 'auc', ad: 'Dialogue AUC (0–2 questions)' },
        { k: 'b05', ad: 'Accuracy · ≤0.5 questions per conversation' },
        { k: 'rho', ad: 'VOI ↔ oracle (Spearman)' },
        { k: 'top1', ad: 'Agreement on the most valuable slot' },
      ],
      sentDipnot: (f) => `AUC is the normalized area under the accuracy vs. number-of-questions curve as the asking threshold is swept. On seen workflows the oracle policy, which knows the true value of information, reaches ${f.oracle}. Single-turn accuracy without asking is ${f.acc} against a Bayes ceiling of ${f.tavan}, ECE ${f.ece}: the model sits at the ceiling, and no hidden information leaks through the text.`,
      p2: ['On seen workflows ', MODEL_AD + ' picks questions as well as the oracle', ' and, without asking, decides at the Bayes ceiling. On the four unseen workflows the VOI ranking is still meaningful, but the decision part stays well below the ceiling: generalising from eight training schemas to the rules of new workflows is the weak point of this version.'],
      polBaslik: 'ASKING POLICIES',
      polAlt: 'first evaluation round · same test set',
      thPol: 'POLICY', thAuc: 'AUC', thB05: '≤0.5 QUESTIONS',
      pol: {
        b2: 'Never asks',
        b3: 'Asks a random slot when unsure',
        b5: 'Asks when the probability set > 1',
        voi: MODEL_AD + ' (VOI)',
        oracle: 'Exact VOI (greedy oracle)',
      },
      polDipnot: 'This comparison was run in the first evaluation round (earlier checkpoint, no Gini bound) on the same test set; baselines were not re-run for the main model, so the VOI row differs slightly from the table above. Bold marks the best value in the column, excluding the oracle. — not measured.',
      p3: (b2, b3) => ['With the same decision model and different asking rules, ', 'choosing the slot by VOI is what makes the difference', `: under a budget of less than half a question per conversation the VOI policy is ${b2} points more accurate than a model that never asks and ${b3} points more accurate than one that asks a random slot.`],
      gercekBaslik: 'REAL CONVERSATIONS',
      gercekAlt: 'SGD and ABCD · neither seen in training',
      thSgd: 'SGD', thAbcd: 'ABCD',
      gercek: [
        { k: 'acc', ad: 'Accuracy on the first message' },
        { k: 'gorulmemis', ad: 'Accuracy on unseen services' },
        { k: 'ece', ad: 'ECE (lower is better)' },
        { k: 'soru', ad: 'Asking rate · no Gini bound → bound' },
        { k: 'auroc', ad: 'AUROC(VOI → error) · no bound → bound' },
        { k: 'kazanc', ad: 'Gain after one question and answer · asked / not asked' },
      ],
      gercekDipnot: 'SGD: 3,812 first user turns, 20 services, 2,766 of them from services never seen in training. ABCD: 918 customer service dialogues, 10 flows; the gain is measured by appending the agent’s real first reply and the customer’s real second message. Asking rates at c = 0.02; “no bound” is the same model without the Gini bound.',
      p4: ['Two results stand out on real conversations. First, ', 'the Gini bound removes almost all unnecessary questions', ': on SGD, where accuracy is already high, the unbounded model wanted to ask in nearly every conversation. Second, on ABCD the decision to ask really tracks the value of information: all of the gain comes from conversations where the model chose to ask, while in the others the answer does not change the decision. The weak point is calibration: ABCD is out of distribution and the model is overconfident there (wrong 19% of the time at confidence above 0.99), and because it is confident it does not ask in those conversations either.'],
      benchBaslik: 'LAYA BENCHMARKS',
      benchAlt: 'single-turn decisions · Laya’s own test code',
      thSet: 'DATASET', thBiz: MODEL_AD, thLaya: 'LAYA', thJev: 'JEV',
      set: {
        typed: 'typed-decisions (2,000 decisions)', massive: 'MASSIVE-en intent (20 options)', banking: 'Banking77 (77 labels)',
        jailbreak: 'Jailbreak detection', routing: 'Model routing', toxic: 'Toxicity', rag: 'RAG passage relevance',
        spam: 'E-mail spam', phishing: 'Phishing', ag: 'AG News', emotion: 'DAIR Emotion', triage: 'Support triage (10 queues)',
      },
      benchDipnot: (ms) => `Laya’s bench_apps code was used as is (seed 13, 400 cases per set). The Laya column is Laya’s best published checkpoint; the Jev column is published results (Jev’s Banking77 result uses 72 labels). Some of the sources Laya saw in training (AG News, Enron spam, phishing, MS MARCO, support tickets) are also in our training data; benchmark texts were removed from it. Single-question latency p50 ${ms} ms (GH200; Laya’s published 33–40 ms is on a T4, different hardware).`,
      p5: ['On single-turn decisions ', MODEL_AD + ' is above Laya on seven of twelve sets and tied on spam', '. The four sets where it trails (AG News, phishing, Emotion and support triage) are where Laya’s broader, unpublished training mix shows. Adding the ability to ask did not weaken single-turn decisions.'],
    },
    sinir: {
      baslik: 'LIMITATIONS',
      liste: [
        'The information that can be asked for is predefined per workflow; a missing piece outside that list cannot be asked.',
        'Value of information is computed one step ahead; questions are chosen greedily, one at a time.',
        'On unseen workflows the decision part stays well below the Bayes ceiling; eight training schemas are too few to generalise to new rules.',
        'On out-of-distribution conversations the model can be overconfident (ECE 0.19 on ABCD), and because it is confident it does not ask there either.',
        'Question wording comes from templates; writing questions in natural language is outside the scope of this version.',
        'The model is English only. Interactive evaluation with real users has not been done yet; the questions and answers on ABCD come from recorded conversations.',
      ],
    },
    kaynak: {
      baslik: 'REFERENCES',
      liste: [
        { ad: 'Laya: typed decisions in a single forward pass', not: 'decision architecture and training objective', url: LAYA_GITHUB },
        { ad: 'Laya checkpoints (Hugging Face)', not: 'for comparison', url: LAYA_HF },
        { ad: 'Rao and Daumé III (2018). Learning to Ask Good Questions', not: 'ranking clarifying questions with EVPI', url: 'https://aclanthology.org/P18-1255/' },
        { ad: 'ModernBERT', not: 'encoder', url: 'https://huggingface.co/answerdotai/ModernBERT-large' },
        { ad: 'Schema-Guided Dialogue (SGD)', not: 'general decision data and real-conversation test', url: 'https://github.com/google-research-datasets/dstc8-schema-guided-dialogue' },
        { ad: 'Action-Based Conversations Dataset (ABCD)', not: 'real customer conversation test', url: 'https://github.com/asappresearch/abcd' },
      ],
      atifBaslik: 'CITATION',
      atif: '@misc{mogan2026lavoir,\n  title  = {' + MODEL_AD + ': Knowing When and What to Ask in a Single Forward Pass},\n  author = {Yılmaz, Furkan and Taşdemir, Habibe Aleyna and Gözay, Muhammed Faruk},\n  year   = {2026},\n  note   = {forthcoming}\n}',
    },
    anim: { oynat: 'Play', duraklat: 'Pause' },
    footer: { lisans: '© 2026 MoganAI Research Group. Apache 2.0.' },
  },
};

const Ctx = createContext(null);

// Iki sayfa tek uygulamada: secili model adreste ?model=tr olarak durur
// (varsayilan Ingilizce LAVOIR). GitHub Pages'te ek yonlendirme gerekmez,
// #bolum capalari da oldugu gibi calisir.
function adrestenModel() {
  try {
    return new URLSearchParams(window.location.search).get('model') === 'tr' ? 'tr' : 'en';
  } catch (e) { return 'en'; }
}

// Bolum bazinda bindirme: nesne bolumler anahtar anahtar birlesir, digerleri
// (dizi, fonksiyon, metin) oldugu gibi degisir.
function bindir(taban, ek) {
  const out = { ...taban };
  for (const [k, v] of Object.entries(ek)) {
    const nesne = (x) => x && typeof x === 'object' && !Array.isArray(x);
    out[k] = nesne(v) && nesne(taban[k]) ? { ...taban[k], ...v } : v;
  }
  return out;
}

export function DilProvider({ children }) {
  const [dil, setDil] = useState(() => {
    // localStorage bazi baglamlarda (gizli sekme, onizleme) erisimde bile
    // hata firlatir -- okuma ve yazma ayri ayri korunuyor.
    try {
      const v = window.localStorage.getItem('mogan-dil');
      if (v === 'tr' || v === 'en') return v;
    } catch (e) { /* yoksay */ }
    return 'tr';
  });

  const [model, setModelDurum] = useState(adrestenModel);

  useEffect(() => {
    try { window.localStorage.setItem('mogan-dil', dil); } catch (e) { /* yoksay */ }
    document.documentElement.lang = dil;
  }, [dil]);

  // Tarayicinin geri / ileri tuslari modeli de degistirsin.
  useEffect(() => {
    const dinle = () => setModelDurum(adrestenModel());
    window.addEventListener('popstate', dinle);
    return () => window.removeEventListener('popstate', dinle);
  }, []);

  const setModel = (m) => {
    if (m === model) return;
    const u = new URL(window.location.href);
    if (m === 'tr') u.searchParams.set('model', 'tr'); else u.searchParams.delete('model');
    u.hash = '';
    window.history.pushState(null, '', u);
    setModelDurum(m);
    window.scrollTo({ top: 0 });
  };

  const t = useMemo(() => (model === 'tr' ? bindir(METIN[dil], METIN_TR[dil]) : METIN[dil]), [dil, model]);

  useEffect(() => { document.title = `${t.modelAd} · MoganAI`; }, [t]);

  return <Ctx.Provider value={{ dil, setDil, model, setModel, t }}>{children}</Ctx.Provider>;
}

export function useDil() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDil, DilProvider icinde cagrilmali');
  return v;
}

// Sayiyi aktif dilin ondalik ayiricisiyla bicimler.
export function useSayi() {
  const { t } = useDil();
  return (v, basamak = 3) => v.toFixed(basamak).replace('.', t.ondalik);
}

// Tek indisli parcalari kalin yazar.
export function kalin(par) {
  return par.map((s, j) =>
    j % 2 ? <strong key={j} className="text-ink-black">{s}</strong> : <React.Fragment key={j}>{s}</React.Fragment>);
}
