import React, { useEffect, useRef, useState } from 'react';
import { useDil } from '../../i18n';
import { c01 } from './ortak';

// Sabit boyutlu bir sahneyi (genis: masaustu, dar: mobil) kapsayici
// genisligine olcekleyip kendi saatiyle dongude oynatir.
//
//   sahneler   [{name, dur}] -- zaman cizelgesi (cues/toplam bunlardan)
//   cues, toplam
//   genis      {w, h}                 -- masaustu sahnesi
//   dar        {w, h, esik, max}      -- kapsayici esikten darsa bu sahne,
//                                        en fazla max px genislikte gosterilir
//   durgunKare hareket azaltma tercihinde gosterilen T
//   sahneAd    {name: etiket}         -- oynatma cubugunda gorunen ad
//   etiket     erisilebilir aciklama
//   children   (T, dar) => sahne
export default function Oynatici({ sahneler, cues, toplam, genis, dar: darCfg, durgunKare, sahneAd, etiket, children }) {
  const { t, dil } = useDil();
  const kap = useRef(null);
  const gorunur = useRef(false);
  const [gen, setGen] = useState(0); // ilk olcumden once sahne cizilmez
  const [durgun] = useState(() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  });
  const [T, setT] = useState(durgun ? durgunKare : 0);
  const [oynuyor, setOynuyor] = useState(!durgun);

  useEffect(() => {
    const el = kap.current;
    if (!el) return;
    const olc = () => setGen(el.clientWidth);
    olc();
    const ro = new ResizeObserver(olc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ekranda degilken saat ilerlemesin.
  useEffect(() => {
    const el = kap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { gorunur.current = e.isIntersecting; }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!oynuyor) return;
    let raf;
    let son = performance.now();
    const tik = (simdi) => {
      // Sekme arka plandan donunce buyuk bir sicrama olmasin.
      const dt = Math.min((simdi - son) / 1000, 0.1);
      son = simdi;
      if (gorunur.current) setT((x) => (x + dt) % toplam);
      raf = requestAnimationFrame(tik);
    };
    raf = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(raf);
  }, [oynuyor, toplam]);

  const atla = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(c01((e.clientX - r.left) / r.width) * toplam * 0.9999);
  };

  const sahne = [...sahneler].reverse().find((s) => T >= cues[s.name]);
  const dar = gen < darCfg.esik;
  const sw = dar ? darCfg.w : genis.w, sh = dar ? darCfg.h : genis.h;
  const gorunen = dar ? Math.min(gen, darCfg.max) : gen;
  const olcek = gorunen / sw;

  return (
    <div className="bg-paper-base">
      {/* olcum kabi tam genislik; sahne dar modda ortalanip darCfg.max'ta sinirlaniyor */}
      <div ref={kap} className="w-full">
        {/* Sahne dili sayfa diliyle ayni: TR'de "müşteri" -> "MÜŞTERİ",
            EN'de "input" -> "INPUT" (TR kurali "İNPUT" yapardi). Buyuk harfe
            cevrilen Ingilizce model ciktisi yok; kimlikler kucuk harf kaliyor. */}
        <div className="relative overflow-hidden mx-auto" style={{ width: gorunen, height: sh * olcek }}
             role="img" aria-label={etiket} lang={dil}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: sw, height: sh,
                        transform: `scale(${olcek})`, transformOrigin: 'top left' }}>
            {gen > 0 ? children(T, dar) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t-2 border-ink-black px-[18px] py-2 bg-grain-fill">
        <button type="button" onClick={() => setOynuyor((x) => !x)}
                aria-label={oynuyor ? t.anim.duraklat : t.anim.oynat}
                className="font-mono text-[12px] font-bold w-8 h-7 border-2 border-ink-black bg-paper-base
                           hover:bg-ink-black hover:text-paper-base transition-colors shrink-0">
          {oynuyor ? '❚❚' : '▶'}
        </button>
        <div className="relative flex-1 h-3 border-2 border-ink-black bg-paper-base cursor-pointer"
             onClick={atla} role="presentation">
          <div className="absolute inset-y-0 left-0 bg-cobalt-deep" style={{ width: `${(T / toplam) * 100}%` }} />
          {sahneler.slice(1).map((s) => (
            <div key={s.name} className="absolute inset-y-0 w-[2px] bg-ink-black/40"
                 style={{ left: `${(cues[s.name] / toplam) * 100}%` }} />
          ))}
        </div>
        <span className="font-mono text-[11px] text-ink-black/70 sm:w-[150px] text-right shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline">{sahneAd[sahne.name]} · </span>{T.toFixed(0)}/{toplam}s
        </span>
      </div>
    </div>
  );
}
