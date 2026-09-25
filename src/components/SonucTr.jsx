import React from 'react';
import { useDil, useSayi, kalin } from '../i18n';
import {
  SENTETIK_TR, LAYA_KIYAS_TR, LAYA_DEVIR_TR, SIFIR_ATIS_TR, SIFIR_ATIS_ORT, ALAN_ICI_TR,
} from '../veri/sonuclar_tr';
import { Baslik, Paragraf, Kutu } from './Ortak';

// LAVOIR-TR sonuclari. Tablolar Sonuc.jsx ile ayni gorunumde; sayilar
// veri/sonuclar_tr.js'ten.
const BOLMELER = ['seen', 'zs'];
const POL_AUC = ['b2', 'b3', 'b5', 'voi', 'oracle'];

const th = 'p-3 border-b-2 border-ink-black font-mono text-xs uppercase font-bold';
const hucre = 'p-3 text-center tabular-nums whitespace-nowrap';

function Tablo({ min = 520, children }) {
  return (
    <div className="w-full overflow-x-auto bg-paper-base">
      <table className="w-full text-left border-collapse" style={{ minWidth: min }}>{children}</table>
    </div>
  );
}

export default function SonucTr() {
  const { t } = useDil();
  const sayi = useSayi();
  const s = t.sonuc;
  const S = SENTETIK_TR;
  const puan = (v) => sayi(v * 100, 1);

  // Ozet kutulari: hepsi veriden.
  const kazanan = SIFIR_ATIS_TR.filter((g) => g.biz[0] > g.laya[0]).length;
  const ozet = s.ozetTr({
    auc: sayi(S.seen.auc.voi),
    oracle: sayi(S.seen.auc.oracle),
    b05: sayi(S.seen.b05.voi),
    b2fark: puan(S.seen.b05.voi - S.seen.b05.b2),
    layaAuc: sayi(LAYA_KIYAS_TR.find((r) => r.k === 'oracle').laya[0]),
    sifir: `${kazanan} / ${SIFIR_ATIS_TR.length}`,
    sifirFark: puan(SIFIR_ATIS_ORT.biz[0] - SIFIR_ATIS_ORT.laya[0]),
  });

  // Turkce is akislari tablosu: satir basina iki hucre (gorulmus, gorulmemis).
  const sentHucre = (k, b) => {
    const x = S[b];
    if (k === 'acc') return `${sayi(x.acc)} / ${sayi(x.tavan)}`;
    if (k === 'auc') return `${sayi(x.auc.voi)} / ${sayi(x.auc.oracle)}`;
    if (k === 'b05') return sayi(x.b05.voi);
    return sayi(x[k]);
  };

  // Politika tablosu: oracle haric sutunun en iyisi kalin.
  const enIyi = {};
  for (const b of BOLMELER) {
    enIyi[b + 'auc'] = Math.max(...['b2', 'b3', 'b5', 'voi'].map((p) => S[b].auc[p]));
    enIyi[b + 'b05'] = Math.max(...Object.values(S[b].b05));
  }

  return (
    <section id="sonuc" className="flex flex-col gap-6 min-w-0">
      <Baslik>{t.nav.sonuc}</Baslik>
      <Paragraf>{s.p1}</Paragraf>

      {/* ---- ozet kutulari ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-black border-2 border-ink-black">
        {ozet.map((o) => (
          <div key={o.k} className="bg-paper-base px-4 py-5 flex flex-col gap-1">
            <strong className="font-display text-3xl font-black tracking-[-0.03em] text-secondary">{o.v}</strong>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-black font-bold">{o.k}</span>
            <span className="text-[13px] leading-[1.45] text-on-surface-variant">{o.not}</span>
          </div>
        ))}
      </div>

      {/* ---- Turkce is akislari ---- */}
      <Kutu baslik={s.sentBaslik} alt={s.sentAlt} dipnot={s.sentDipnotTr}>
        <Tablo>
          <thead>
            <tr className="bg-ink-black/[0.04]">
              <th className={`${th} border-r-2`}>{s.thOlcut}</th>
              <th className={`${th} border-r-2 text-center`}>{s.thGoruldu}</th>
              <th className={`${th} text-center`}>{s.thGorulmedi}</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {s.sentTr.map((o) => (
              <tr key={o.k} className="border-b border-ink-black/20">
                <td className="p-3 border-r-2 border-ink-black font-sans">{o.ad}</td>
                <td className={`${hucre} border-r-2 border-ink-black font-bold`}>{sentHucre(o.k, 'seen')}</td>
                <td className={`${hucre} text-ink-black/75`}>{sentHucre(o.k, 'zs')}</td>
              </tr>
            ))}
          </tbody>
        </Tablo>
      </Kutu>

      <Paragraf>{kalin(s.p2)}</Paragraf>

      {/* ---- soru sorma politikalari ---- */}
      <Kutu baslik={s.polBaslik} alt={s.polAlt} dipnot={s.polDipnot}>
        <Tablo min={640}>
          <thead>
            <tr className="bg-ink-black/[0.04]">
              <th rowSpan={2} className={`${th} border-r-2 align-bottom`}>{s.thPol}</th>
              <th colSpan={2} className={`${th} border-r-2 text-center`}>{s.thGoruldu}</th>
              <th colSpan={2} className={`${th} text-center`}>{s.thGorulmedi}</th>
            </tr>
            <tr className="bg-ink-black/[0.04]">
              {BOLMELER.map((b) => ['auc', 'b05'].map((o, j) => (
                <th key={b + o} className={`${th} text-center ${j === 1 && b === 'seen' ? 'border-r-2' : ''}`}>
                  {o === 'auc' ? s.thAuc : s.thB05}
                </th>
              )))}
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {POL_AUC.map((p) => {
              const tavan = p === 'oracle', bizim = p === 'voi';
              return (
                <tr key={p} className={`border-b border-ink-black/20 ${bizim ? 'bg-ink-black/[0.05]' : ''} ${tavan ? 'text-ink-black/50 italic' : ''}`}>
                  <td className={`p-3 border-r-2 border-ink-black whitespace-nowrap font-sans ${bizim ? 'font-bold text-cobalt-deep' : ''}`}>{s.pol[p]}</td>
                  {BOLMELER.map((b) => ['auc', 'b05'].map((o, j) => {
                    const x = S[b][o][p];
                    const en = !tavan && x === enIyi[b + o];
                    return (
                      <td key={b + o} className={`${hucre} ${j === 1 && b === 'seen' ? 'border-r-2 border-ink-black' : ''}
                                                  ${en ? 'font-bold text-secondary' : tavan ? '' : 'text-ink-black/75'}`}>
                        {x == null ? '—' : sayi(x)}
                      </td>
                    );
                  }))}
                </tr>
              );
            })}
          </tbody>
        </Tablo>
      </Kutu>

      {/* ---- Laya-multilingual ayni is akislarinda ---- */}
      <Kutu baslik={s.layaBaslik} alt={s.layaAlt}
            dipnot={s.layaDipnot({ oran: sayi(LAYA_DEVIR_TR.seen.oran * 100, 1), acc: sayi(LAYA_DEVIR_TR.seen.acc) })}>
        <Tablo min={620}>
          <thead>
            <tr className="bg-ink-black/[0.04]">
              <th rowSpan={2} className={`${th} border-r-2 align-bottom`}>{s.thOlcut}</th>
              <th colSpan={2} className={`${th} border-r-2 text-center`}>{s.thGoruldu}</th>
              <th colSpan={2} className={`${th} text-center`}>{s.thGorulmedi}</th>
            </tr>
            <tr className="bg-ink-black/[0.04]">
              {[0, 1].map((i) => (
                <React.Fragment key={i}>
                  <th className={`${th} text-center`}>{s.thLayaTr}</th>
                  <th className={`${th} text-center text-cobalt-deep ${i === 0 ? 'border-r-2' : ''}`}>{s.thBizTr}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {LAYA_KIYAS_TR.map((r) => (
              <tr key={r.k} className="border-b border-ink-black/20">
                <td className="p-3 border-r-2 border-ink-black font-sans">{s.layaSatir[r.k]}</td>
                {[0, 1].map((i) => (
                  <React.Fragment key={i}>
                    <td className={`${hucre} text-ink-black/60`}>{r.laya[i] == null ? s.soramaz : sayi(r.laya[i])}</td>
                    <td className={`${hucre} font-bold bg-ink-black/[0.05] ${i === 0 ? 'border-r-2 border-ink-black' : ''}`}>{sayi(r.biz[i])}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </Tablo>
      </Kutu>

      <Paragraf>{kalin(s.p3)}</Paragraf>

      {/* ---- sifir atis: TabiBench ---- */}
      <Kutu baslik={s.sifirBaslik} alt={s.sifirAlt} dipnot={s.sifirDipnot}>
        <Tablo min={600}>
          <thead>
            <tr className="bg-ink-black/[0.04]">
              <th rowSpan={2} className={`${th} border-r-2 align-bottom`}>{s.thGorev}</th>
              <th colSpan={2} className={`${th} border-r-2 text-center`}>{s.thAcc}</th>
              <th colSpan={2} className={`${th} text-center`}>{s.thF1}</th>
            </tr>
            <tr className="bg-ink-black/[0.04]">
              {[0, 1].map((i) => (
                <React.Fragment key={i}>
                  <th className={`${th} text-center text-cobalt-deep`}>{s.thBizTr}</th>
                  <th className={`${th} text-center ${i === 0 ? 'border-r-2' : ''}`}>{s.thLayaTr}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {[...SIFIR_ATIS_TR, { k: 'ort', ...SIFIR_ATIS_ORT }].map((g) => {
              const ort = g.k === 'ort';
              return (
                <tr key={g.k} className={`border-b border-ink-black/20 ${ort ? 'border-t-2 border-t-ink-black bg-ink-black/[0.04]' : ''}`}>
                  <td className={`p-3 border-r-2 border-ink-black font-sans ${ort ? 'font-bold' : ''}`}>
                    {s.gorev[g.k]}{g.n ? <span className="font-mono text-[11px] text-ink-black/50"> · n={g.n}</span> : null}
                  </td>
                  {[0, 1].map((i) => {
                    const biz = g.biz[i] > g.laya[i];
                    return (
                      <React.Fragment key={i}>
                        <td className={`${hucre} bg-ink-black/[0.05] ${biz ? 'font-bold text-secondary' : 'text-ink-black/75'}`}>{sayi(g.biz[i])}</td>
                        <td className={`${hucre} ${!biz ? 'font-bold' : 'text-ink-black/60'} ${i === 0 ? 'border-r-2 border-ink-black' : ''}`}>{sayi(g.laya[i])}</td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Tablo>
      </Kutu>

      <Paragraf>{kalin(s.p4)}</Paragraf>

      {/* ---- alan ici Turkce karar gorevleri (adil degil) ---- */}
      <Kutu baslik={s.alanBaslik} alt={s.alanAlt} dipnot={s.alanDipnot}>
        <Tablo min={440}>
          <thead>
            <tr className="bg-ink-black/[0.04]">
              <th className={`${th} border-r-2`}>{s.thGorev}</th>
              <th className={`${th} border-r-2 text-center text-cobalt-deep`}>{s.thBizTr}</th>
              <th className={`${th} text-center`}>{s.thLayaTr}</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {ALAN_ICI_TR.map((g) => {
              const biz = g.biz > g.laya;
              return (
                <tr key={g.k} className="border-b border-ink-black/20">
                  <td className="p-3 border-r-2 border-ink-black font-sans">{s.alan[g.k]}</td>
                  <td className={`${hucre} border-r-2 border-ink-black bg-ink-black/[0.05] ${biz ? 'font-bold' : 'text-ink-black/75'}`}>{sayi(g.biz)}</td>
                  <td className={`${hucre} ${!biz ? 'font-bold' : 'text-ink-black/60'}`}>{sayi(g.laya)}</td>
                </tr>
              );
            })}
          </tbody>
        </Tablo>
      </Kutu>
    </section>
  );
}
