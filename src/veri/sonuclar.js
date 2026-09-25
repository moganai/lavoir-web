// Sonuclar -- ana model 1999601 joint_v2 (Gini sinirli VOI, W_RL=0, ~104k
// ornek). Kaynak: laya_voi/modelilerleme.md, hepsi_eval 1999603.

// Bizim is akislarimiz (sentetik, kesin oracle ile). auc = dogruluk-soru
// (0-2 soru) ust zarfinin normalize alani; b05 = konusma basina en fazla
// 0,5 soru butcesinde en iyi dogruluk; rho/top1 = model VOI'si ile kesin VOI.
export const SENTETIK = {
  seen: { auc: 0.799, oracle: 0.797, b05: 0.751, rho: 0.851, top1: 0.937, acc: 0.648, tavan: 0.659, ece: 0.016 },
  zs:   { auc: 0.612, b05: 0.581, rho: 0.689, top1: 0.627 },
};

// Soru sorma politikalari -- ILK DEGERLENDIRME TURU (checkpoint 1991366,
// ayni test seti). Ana model icin baseline'lar ayrica kosulmadi.
export const POLITIKALAR = [
  { k: 'b2',     seen: { auc: 0.611, b05: 0.611 }, zs: { auc: 0.492, b05: 0.492 } },
  { k: 'b3',     seen: { auc: 0.763, b05: 0.660 }, zs: { auc: 0.574, b05: 0.542 } },
  { k: 'b5',     seen: { auc: 0.791, b05: null },  zs: { auc: 0.595, b05: null } },
  { k: 'voi',    seen: { auc: 0.799, b05: 0.755 }, zs: { auc: 0.616, b05: 0.579 }, bizim: true },
  { k: 'oracle', seen: { auc: 0.800, b05: null },  zs: { auc: 0.633, b05: null }, tavan: true },
];

// Gercek konusmalar (ikisi de egitimde yok, zero-shot). Soru orani c = 0,02'de;
// once = ayni model Gini siniri olmadan (1997058).
export const GERCEK = {
  sgd:  { n: 3812, acc: 0.942, gorulmemis: 0.930, ece: 0.044, soruOnce: 0.93, soru: 0.086, aurocOnce: 0.70, auroc: 0.84 },
  abcd: { n: 918, acc: 0.657, ece: 0.186, soruOnce: 0.92, soru: 0.58, aurocOnce: 0.65, auroc: 0.71, sorarKazanc: 8.3, sormazKazanc: 0 },
};

// Laya'nin kendi benchmark kodu (bench_apps.build, seed 13, gorev basina 400
// vaka). Laya = yayinladigi en iyi checkpoint sonucu; Jev = yayinlanmis sonuc.
export const BENCH = [
  { k: 'typed',    biz: 0.774, laya: 0.766, jev: 0.727 },
  { k: 'massive',  biz: 0.805, laya: 0.783 },
  { k: 'banking',  biz: 0.533, laya: 0.492, jev: 0.870, not: true },
  { k: 'jailbreak', biz: 0.825, laya: 0.762 },
  { k: 'routing',  biz: 0.754, laya: 0.659 },
  { k: 'toxic',    biz: 0.605, laya: 0.530 },
  { k: 'rag',      biz: 0.665, laya: 0.657 },
  { k: 'spam',     biz: 0.993, laya: 0.993 },
  { k: 'phishing', biz: 0.978, laya: 0.993 },
  { k: 'ag',       biz: 0.905, laya: 0.953, jev: 0.910 },
  { k: 'emotion',  biz: 0.575, laya: 0.600, jev: 0.480 },
  { k: 'triage',   biz: 0.383, laya: 0.522 },
];
export const GECIKME_MS = 31; // tek soru p50, GH200

// Kunye: veri ve egitim.
export const KUNYE = {
  sema: { egitim: 8, gorulmemis: 4 },
  ornek: { egitim: 21601, test: 10811 },
  genel: 82000,
  kaynak: 40,
  toplam: 104000,
};
