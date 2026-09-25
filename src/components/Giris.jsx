import React from 'react';
import { useDil } from '../i18n';
import ModelSec from './ModelSec';

export default function Giris() {
  const { t } = useDil();
  const h = t.hero;
  // Adresler modele gore metinde (t.hero.baglanti); bos olan tiklanamaz ve soluk gorunur.
  const BAGLANTI = h.baglanti;

  const dugmeler = [
    ['hf', h.hfEt, BAGLANTI.hf, <img src={`${import.meta.env.BASE_URL}images/hf.png`} alt="" className="h-4 w-auto" />],
    ['paper', h.paperEt, BAGLANTI.paper, <img src={`${import.meta.env.BASE_URL}images/arxiv.png`} alt="" className="h-4 w-auto" />],
    ['kod', h.kodEt, BAGLANTI.kod, <span className="font-mono text-sm font-black">{'</>'}</span>],
  ];

  return (
    <section id="giris" className="flex flex-col gap-6 min-w-0">
      <div className="relative overflow-hidden border-2 border-ink-black bg-grain-fill
                      px-6 pt-10 pb-8 md:px-8 flex flex-col items-center gap-[20px]
                      text-center slash-deco">
        <div className="ust-gir inline-block bg-cobalt-deep text-on-primary px-3 py-[5px]
                        border-2 border-ink-black font-mono text-xs uppercase font-bold">
          {h.rozet}
        </div>

        {/* Logo model adini zaten yaziyor; alt metni erisilebilir adi tasiyor. */}
        <h1 className={`ust-gir w-full ${h.logo.gen} m-0`} style={{ animationDelay: '.08s' }}>
          <img key={h.logo.src} src={`${import.meta.env.BASE_URL}images/${h.logo.src}`} alt={t.modelAd}
               width={h.logo.w} height={h.logo.h} className="w-full h-auto object-contain block" />
        </h1>
        <div className="ust-gir font-mono text-sm md:text-base uppercase tracking-[.12em]
                        font-bold text-cobalt-deep" style={{ animationDelay: '.11s' }}>
          {h.alt}
        </div>

        <p className="ust-gir font-sans text-base md:text-[17px] text-on-surface-variant
                      max-w-2xl leading-relaxed m-0" style={{ animationDelay: '.14s' }}>
          {h.ozet[0]}<strong className="text-ink-black">{h.ozet[1]}</strong>{h.ozet[2]}
        </p>

        <div className="ust-gir grid grid-cols-3 gap-px bg-ink-black border-2 border-ink-black w-full max-w-[420px]"
             style={{ animationDelay: '.17s' }}>
          {dugmeler.map(([k, et, url, isaret]) => {
            const ic = (<>{isaret}<span className="font-mono text-[10px] font-bold uppercase tracking-[.1em]">{et}</span></>);
            const ortak = 'bg-paper-base px-2 sm:px-4 py-[10px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0';
            return url ? (
              <a key={k} href={url} target="_blank" rel="noopener noreferrer"
                 className={`${ortak} text-cobalt-deep no-underline hover:bg-grain-fill transition-colors`}>{ic}</a>
            ) : (
              <span key={k} className={`${ortak} text-ink-black/30 [&>img]:opacity-40`}>{ic}</span>
            );
          })}
        </div>

        <div className="ust-gir font-mono text-xs md:text-[13px] text-ink-black/70
                        border-t-2 border-ink-black/20 pt-4 w-full max-w-[760px]"
             style={{ animationDelay: '.2s' }}>
          <strong>{h.yazarlar}</strong> Furkan Yılmaz, Habibe Aleyna Taşdemir, Muhammed Faruk Gözay
          <div className="text-cobalt-deep font-bold mt-1">{h.grup}</div>
        </div>
      </div>

      {/* Model secimi: giris kutusunun hemen altinda */}
      <ModelSec />

      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs uppercase
                      tracking-[.14em] text-ink-black/55 border-b-2 border-ink-black pb-2">
        <span>{h.metaSol}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-black border-2 border-ink-black">
        {h.gercek.map((g, i) => (
          <div key={g.k} className="kart-gir bg-paper-base px-4 py-5 flex flex-col gap-1"
               style={{ animationDelay: `${0.24 + i * 0.08}s` }}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-black/55">{g.k}</span>
            <strong className="font-mono text-sm font-bold text-ink-black">{g.v}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
