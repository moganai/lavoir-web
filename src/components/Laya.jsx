import React from 'react';
import { useDil, kalin, LAYA_GITHUB } from '../i18n';
import { Baslik, Paragraf, Kutu } from './Ortak';
import KarsilastirmaAkis from './KarsilastirmaAkis';

// Laya'ya atif ve "neyi devraldik / neyi ekledik" karsilastirmasi, ardindan
// cozdugumuz sorun. Laya'nin mimarisi burada yeniden anlatilmiyor.
export default function Laya() {
  const { t } = useDil();
  const l = t.laya;
  const s = t.sorun;

  const liste = (baslik, maddeler, renk) => (
    <div className="bg-paper-base px-5 py-5 flex flex-col gap-3">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[.14em]" style={{ color: renk }}>
        {baslik}
      </span>
      <ul className="m-0 p-0 list-none flex flex-col gap-2">
        {maddeler.map((m) => (
          <li key={m} className="flex gap-2 text-sm leading-[1.5] text-on-surface-variant">
            <span className="mt-[7px] w-[7px] h-[7px] shrink-0" style={{ backgroundColor: renk }} />
            {m}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <section id="laya" className="flex flex-col gap-6 min-w-0">
        <Baslik>{l.baslik}</Baslik>
        <Paragraf>
          {l.p1[0]}
          <a href={LAYA_GITHUB} target="_blank" rel="noopener noreferrer"
             className="font-bold text-cobalt-deep underline decoration-2 underline-offset-4">{l.p1[1]}</a>
          {l.p1[2]}
        </Paragraf>
        <Paragraf>
          {l.p2[0]}
          <a href={LAYA_GITHUB} target="_blank" rel="noopener noreferrer"
             className="text-cobalt-deep underline decoration-2 underline-offset-4">{l.p2[1]}</a>
          {l.p2[2]}
        </Paragraf>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-black border-2 border-ink-black">
          {liste(l.solBaslik, l.sol, '#254a96')}
          {liste(l.sagBaslik, l.sag, '#006c48')}
        </div>
      </section>

      <section id="sorun" className="flex flex-col gap-6 min-w-0">
        <Baslik>{s.baslik}</Baslik>
        <Paragraf>{kalin(s.p)}</Paragraf>
        <Kutu baslik={s.ornek.baslik} alt={s.ornek.alt} dipnot={s.ornek.dipnot}>
          <KarsilastirmaAkis />
        </Kutu>
      </section>
    </>
  );
}
