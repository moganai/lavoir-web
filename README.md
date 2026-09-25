# LAVOIR tanıtım sayfası

MoganAI sitesiyle (moganai.github.io) aynı tasarım dilinde, tek sayfalık tanıtım. Vite + React 18, Tailwind CDN.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/
```

## Güncellenecek yerler

| Ne | Nerede |
|---|---|
| Model adı (`LAVOIR`) | `src/i18n.jsx` → `MODEL_AD`, ayrıca `index.html` → `<title>` |
| Sonuç sayıları | `src/veri/sonuclar.js` (ana model 1999601 joint_v2; kaynak `laya_voi/modelilerleme.md`). Özet kutuları ve metindeki farklar bu dosyadan hesaplanır |
| HF / makale / kod bağlantıları | `src/components/Giris.jsx` → `BAGLANTI` (boşsa düğme soluk ve tıklanamaz) |
| Tüm metinler (TR/EN) | `src/i18n.jsx` |
| Atıf (BibTeX) | `src/i18n.jsx` → `kaynak.atif` |

## Animasyonlar

| Bölüm | Dosya | İçerik |
|---|---|---|
| Sorun | `components/KarsilastirmaAkis.jsx` | "LAVOIR vs Laya" (ecommerce_returns/00017, 43 sn). Kaynak: `LAVOIR vs Laya.html`, outro çıkarıldı |
| VOI başlığı | `components/DonguAkis.jsx` | "VOI başlığı ne zaman devreye girer?" döngü şeması (telecom_support/00118, 33,5 sn) |

İkisi de ortak oynatıcıyı kullanıyor: `components/sahne/Oynatici.jsx` (saat, ölçekleme, 860 px altında dikey mobil
sahne, oynatma çubuğu, hareket azaltma tercihinde sabit kare) ve `components/sahne/ortak.js` (palet, yumuşatma,
`blend`, zaman çizelgesi). Tasarım aracından gelen yeni bir animasyon da aynı şekilde bağlanır: sahne kodu `window.*`
yerine bu ikisinden import eder, `Oynatici`'ye `(T, dar) => <Piece …/>` verilir.

## Yayına alma

`.github/workflows/deploy.yml` ana sitedekiyle aynı: yeni repoya taşınınca `main`'e her itişte GitHub Pages'e kurar.
Proje sayfası olarak yayında (`aleynatasdemir.github.io/lavoir.github.io/`); `vite.config.js` → `base: '/lavoir.github.io/'`. Görseller `import.meta.env.BASE_URL` ile çözülür.
