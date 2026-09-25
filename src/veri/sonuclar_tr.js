// LAVOIR-TR sonuclari -- egitim 2006681 joint_v2 (MoganBERT-TR, Gini sinirli
// VOI). Kaynak: laya_voi/ILERLEME.md; degerlendirme 2007893, Laya-multilingual
// kiyasi 2008372, sifir atis benchmark 2008175.

// Turkce is akislarimiz (sentetik, kesin oracle ile). seen: 11 sema, 7.140
// ornek; zs: egitimde olmayan 5 sema, 6.539 ornek. auc/b05 politika basina.
export const SENTETIK_TR = {
  seen: {
    acc: 0.631, tavan: 0.655, fark: -0.024, farkGA: [-0.033, -0.015], ece: 0.028, kl: 0.101,
    rho: 0.833, top1: 0.924,
    auc: { b2: 0.589, b3: 0.745, b5: 0.772, voi: 0.788, oracle: 0.782 },
    b05: { b2: 0.589, b3: 0.673, voi: 0.752 },
  },
  zs: {
    acc: 0.451, tavan: 0.678, fark: -0.227, farkGA: [-0.239, -0.215], ece: 0.185, kl: 1.640,
    rho: 0.618, top1: 0.594,
    auc: { b2: 0.448, b3: 0.507, b5: 0.527, voi: 0.543, oracle: 0.555 },
    b05: { b2: 0.448, b3: 0.484, voi: 0.526 },
  },
};

// Laya-multilingual ayni Turkce is akislarinda (2008372). Laya soru
// secemedigi icin sorulari disaridaki secici (rastgele / oracle) seciyor,
// karari Laya veriyor. null = uygulanamaz.
export const LAYA_KIYAS_TR = [
  { k: 'ilk',    laya: [0.322, 0.326], biz: [0.589, 0.448] },
  { k: 'b3',     laya: [0.359, 0.355], biz: [0.745, 0.507] },
  { k: 'oracle', laya: [0.393, 0.399], biz: [0.782, 0.555] },
  { k: 'voi',    laya: [null, null],   biz: [0.788, 0.543] },
  { k: 'iki',    laya: [0.418, 0.432], biz: [0.875, 0.583] },
];
// Laya'nin kendi kurali (guven = 1 - H/log k < 0,85 -> devret).
export const LAYA_DEVIR_TR = { seen: { oran: 0.696, acc: 0.423 }, zs: { oran: 0.583, acc: 0.405 } };

// TabiBench'in 8 karar gorevi: iki modelin de egitiminde yok (sifir atis).
export const SIFIR_ATIS_TR = [
  { k: 'haber',  n: 250,  biz: [0.884, 0.885], laya: [0.772, 0.754] },
  { k: 'tweet',  n: 146,  biz: [0.370, 0.252], laya: [0.445, 0.426] },
  { k: 'nefret', n: 1000, biz: [0.570, 0.471], laya: [0.373, 0.321] },
  { k: 'sick',   n: 1000, biz: [0.312, 0.243], laya: [0.247, 0.213] },
  { k: 'tibbi',  n: 1000, biz: [0.567, 0.568], laya: [0.413, 0.363] },
  { k: 'atif',   n: 1000, biz: [0.543, 0.542], laya: [0.503, 0.504] },
  { k: 'rol',    n: 1000, biz: [0.424, 0.359], laya: [0.356, 0.306] },
  { k: 'tez',    n: 1000, biz: [0.754, 0.751], laya: [0.509, 0.488] },
];
export const SIFIR_ATIS_ORT = { biz: [0.553, 0.509], laya: [0.452, 0.422] };

// Egitim bolmeleri Lavoir-TR'nin genel verisinde olan 17 gorev (test
// bolmeleri ayri). Laya-multilingual bunlari gormedi: kiyas adil degil.
export const ALAN_ICI_TR = [
  { k: 'cola', biz: 0.523, laya: 0.544 }, { k: 'sst2', biz: 0.781, laya: 0.604 },
  { k: 'mrpc', biz: 0.705, laya: 0.612 }, { k: 'qqp', biz: 0.883, laya: 0.584 },
  { k: 'mnli', biz: 0.771, laya: 0.652 }, { k: 'qnli', biz: 0.839, laya: 0.639 },
  { k: 'rte', biz: 0.893, laya: 0.897 },  { k: 'stsb', biz: 0.420, laya: 0.150 },
  { k: 'massive', biz: 0.870, laya: 0.603 }, { k: 'saldirgan', biz: 0.889, laya: 0.692 },
  { k: 'duygu', biz: 0.665, laya: 0.647 }, { k: 'yildiz', biz: 0.567, laya: 0.127 },
  { k: 'urun', biz: 0.870, laya: 0.607 },  { k: 'haberKonu', biz: 0.930, laya: 0.730 },
  { k: 'spam', biz: 0.867, laya: 0.498 },  { k: 'sahte', biz: 0.675, laya: 0.359 },
  { k: 'nefretH', biz: 0.577, laya: 0.346 },
];

// Kunye: veri ve egitim (2006681).
export const KUNYE_TR = {
  sema: { egitim: 11, gorulmemis: 5 },
  voi: { egitim: 43784, seen: 7140, zs: 6539 },
  genel: 66935,
  arac: 5464,
  ingilizce: 20000,
  toplam: 136183,
  dakika: 49,          // 48 dk 37 sn, 16 GH200
  parametre: { tr: 164, en: 421 },
  token: { tr: 122, en: 222 },  // ayni Turkce ornek: MoganBERT-TR / ModernBERT tokenizer'i
};
