import React from 'react';
import { useDil, useSayi, kalin } from '../i18n';
import { SENTETIK, POLITIKALAR, GERCEK, BENCH, GECIKME_MS } from '../veri/sonuclar';
import { Baslik, Paragraf, Kutu } from './Ortak';

const BOLMELER = ['seen', 'zs'];
const OLCUTLER = ['auc', 'b05'];

const th = 'p-3 border-b-2 border-ink-black font-mono text-xs uppercase font-bold';

export default function Sonuc() {
  const { t, dil } = useDil();
  const sayi = useSayi();
  const s = t.sonuc;

  // Yuzde: TR "%9", EN "9%". Onun altindaki degerler bir ondalikla.
  const yuzde = (v) => {
    const n = v * 100;
    const m = sayi(n, n < 10 ? 1 : 0);
    return dil === 'tr' ? `%${m}` : `${m}%`;
  };
  const arti = (v) => (v > 0 ? '+' : '') + sayi(v, v === 0 ? 0 : 1);

  // Ozet kutulari: hepsi veriden.
  const ustunde = BENCH.filter((b) => b.biz > b.laya).length;
  const ozet = s.ozet({
    auc: sayi(SENTETIK.seen.auc),
    oracle: sayi(SENTETIK.seen.oracle),
    soru: `${yuzde(GERCEK.sgd.soruOnce)} → ${yuzde(GERCEK.sgd.soru)}`,
    kazanc: arti(GERCEK.abcd.sorarKazanc),
    bench: `${ustunde} / ${BENCH.length}`,
  });

  // Politika tablosu: sutun basina en iyi (oracle haric).
  const enIyi = {};
  for (const b of BOLMELER) for (const o of OLCUTLER) {
    const d = POLITIKALAR.filter((p) => !p.tavan).map((p) => p[b][o]).filter((x) => x != null);
    enIyi[b + o] = Math.max(...d);
  }
  const bul = (k) => POLITIKALAR.find((p) => p.k === k).seen.b05;
  const fark = (k) => sayi((bul('voi') - bul(k)) * 100, 1);

  // Gercek konusmalar tablosunun hucreleri.
  const g = GERCEK;
  const gercekHucre = {
    acc: [sayi(g.sgd.acc), sayi(g.abcd.acc)],
    gorulmemis: [sayi(g.sgd.gorulmemis), '—'],
    ece: [sayi(g.sgd.ece), sayi(g.abcd.ece)],
    soru: [`${yuzde(g.sgd.soruOnce)} → ${yuzde(g.sgd.soru)}`, `${yuzde(g.abcd.soruOnce)} → ${yuzde(g.abcd.soru)}`],
    auroc: [`${sayi(g.sgd.aurocOnce, 2)} → ${sayi(g.sgd.auroc, 2)}`, `${sayi(g.abcd.aurocOnce, 2)} → ${sayi(g.abcd.auroc, 2)}`],
    kazanc: ['—', `${arti(g.abcd.sorarKazanc)} / ${arti(g.abcd.sormazKazanc)}`],
  };

  const sn = SENTETIK.seen;

  return (
    <section id="sonuc" className="flex flex-col gap-6 min-w-0">
      <Baslik>{s.baslik}</Baslik>
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

      {/* ---- bizim is akislarimiz ---- */}
      <Kutu baslik={s.sentBaslik} alt={s.sentAlt}
            dipnot={s.sentDipnot({ oracle: sayi(sn.oracle), acc: sayi(sn.acc), tavan: sayi(sn.tavan), ece: sayi(sn.ece) })}>
        <div className="w-full overflow-x-auto bg-paper-base">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-ink-black/[0.04]">
                <th className={`${th} border-r-2`}>{s.thOlcut}</th>
                <th className={`${th} border-r-2 text-center`}>{s.thGoruldu}</th>
                <th className={`${th} text-center`}>{s.thGorulmedi}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {s.sent.map((o) => (
                <tr key={o.k} className="border-b border-ink-black/20">
                  <td className="p-3 border-r-2 border-ink-black font-sans">{o.ad}</td>
                  <td className="p-3 border-r-2 border-ink-black text-center tabular-nums font-bold">{sayi(SENTETIK.seen[o.k])}</td>
                  <td className="p-3 text-center tabular-nums text-ink-black/75">{sayi(SENTETIK.zs[o.k])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Kutu>

      <Paragraf>{kalin(s.p2)}</Paragraf>

      {/* ---- politika karsilastirmasi (ilk tur) ---- */}
      <Kutu baslik={s.polBaslik} alt={s.polAlt} dipnot={s.polDipnot}>
        <div className="w-full overflow-x-auto bg-paper-base">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-ink-black/[0.04]">
                <th rowSpan={2} className={`${th} border-r-2 align-bottom`}>{s.thPol}</th>
                <th colSpan={2} className={`${th} border-r-2 text-center`}>{s.thGoruldu}</th>
                <th colSpan={2} className={`${th} text-center`}>{s.thGorulmedi}</th>
              </tr>
              <tr className="bg-ink-black/[0.04]">
                {BOLMELER.map((b) => OLCUTLER.map((o, j) => (
                  <th key={b + o} className={`${th} text-center ${j === 1 && b === 'seen' ? 'border-r-2' : ''}`}>
                    {o === 'auc' ? s.thAuc : s.thB05}
                  </th>
                )))}
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {POLITIKALAR.map((p) => (
                <tr key={p.k} className={`border-b border-ink-black/20
                                          ${p.bizim ? 'bg-ink-black/[0.05]' : ''}
                                          ${p.tavan ? 'text-ink-black/50 italic' : ''}`}>
                  <td className={`p-3 border-r-2 border-ink-black whitespace-nowrap font-sans
                                  ${p.bizim ? 'font-bold text-cobalt-deep' : ''}`}>{s.pol[p.k]}</td>
                  {BOLMELER.map((b) => OLCUTLER.map((o, j) => {
                    const x = p[b][o];
                    const en = !p.tavan && x === enIyi[b + o];
                    return (
                      <td key={b + o} className={`p-3 text-center tabular-nums
                                                  ${j === 1 && b === 'seen' ? 'border-r-2 border-ink-black' : ''}
                                                  ${en ? 'font-bold text-secondary' : p.tavan ? '' : 'text-ink-black/75'}`}>
                        {x == null ? '—' : sayi(x)}
                      </td>
                    );
                  }))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Kutu>

      <Paragraf>{kalin(s.p3(fark('b2'), fark('b3')))}</Paragraf>

      {/* ---- gercek konusmalar ---- */}
      <Kutu baslik={s.gercekBaslik} alt={s.gercekAlt} dipnot={s.gercekDipnot}>
        <div className="w-full overflow-x-auto bg-paper-base">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-ink-black/[0.04]">
                <th className={`${th} border-r-2`}>{s.thOlcut}</th>
                <th className={`${th} border-r-2 text-center`}>{s.thSgd}</th>
                <th className={`${th} text-center`}>{s.thAbcd}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {s.gercek.map((o) => (
                <tr key={o.k} className="border-b border-ink-black/20">
                  <td className="p-3 border-r-2 border-ink-black font-sans">{o.ad}</td>
                  <td className="p-3 border-r-2 border-ink-black text-center tabular-nums whitespace-nowrap">{gercekHucre[o.k][0]}</td>
                  <td className="p-3 text-center tabular-nums whitespace-nowrap">{gercekHucre[o.k][1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Kutu>

      <Paragraf>{kalin(s.p4)}</Paragraf>

      {/* ---- Laya benchmark'lari ---- */}
      <Kutu baslik={s.benchBaslik} alt={s.benchAlt} dipnot={s.benchDipnot(GECIKME_MS)}>
        <div className="w-full overflow-x-auto bg-paper-base">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-ink-black/[0.04]">
                <th className={`${th} border-r-2`}>{s.thSet}</th>
                <th className={`${th} border-r-2 text-center text-cobalt-deep`}>{s.thBiz}</th>
                <th className={`${th} border-r-2 text-center`}>{s.thLaya}</th>
                <th className={`${th} text-center`}>{s.thJev}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {BENCH.map((b) => {
                const biz = b.biz > b.laya, esit = b.biz === b.laya;
                return (
                  <tr key={b.k} className="border-b border-ink-black/20">
                    <td className="p-3 border-r-2 border-ink-black font-sans whitespace-nowrap">{s.set[b.k]}</td>
                    <td className={`p-3 border-r-2 border-ink-black text-center tabular-nums bg-ink-black/[0.05]
                                    ${biz ? 'font-bold text-secondary' : esit ? 'font-bold' : 'text-ink-black/75'}`}>{sayi(b.biz)}</td>
                    <td className={`p-3 border-r-2 border-ink-black text-center tabular-nums
                                    ${!biz && !esit ? 'font-bold' : esit ? 'font-bold' : 'text-ink-black/60'}`}>{sayi(b.laya)}</td>
                    <td className="p-3 text-center tabular-nums text-ink-black/60">
                      {b.jev == null ? '—' : `${sayi(b.jev)}${b.not ? '*' : ''}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Kutu>

      <Paragraf>{kalin(s.p5)}</Paragraf>
    </section>
  );
}
