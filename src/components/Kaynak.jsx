import React from 'react';
import { useDil } from '../i18n';
import { Baslik } from './Ortak';

// Sinirliliklar ve kaynaklar tek bolumde: ikisi de kisa listeler.
export default function Kaynak() {
  const { t } = useDil();
  const n = t.sinir;
  const k = t.kaynak;

  return (
    <>
      <section id="sinir" className="flex flex-col gap-6 min-w-0">
        <Baslik>{n.baslik}</Baslik>
        <ol className="m-0 p-0 list-none border-2 border-ink-black bg-paper-base">
          {n.liste.map((m, i) => (
            <li key={i} className="flex gap-4 px-[18px] py-3 border-b border-ink-black/20 last:border-b-0">
              <span className="font-mono text-[11px] font-bold text-ink-black/45 pt-[3px]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm leading-[1.55] text-on-surface-variant">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="kaynak" className="flex flex-col gap-6 min-w-0">
        <Baslik>{k.baslik}</Baslik>
        <div className="grid grid-cols-1 gap-px bg-ink-black border-2 border-ink-black">
          {k.liste.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
               className="group bg-paper-base px-[18px] py-3 flex flex-wrap items-baseline justify-between
                          gap-2 no-underline hover:bg-grain-fill transition-colors">
              <span className="font-sans text-sm font-semibold text-ink-black">{r.ad}</span>
              <span className="font-mono text-[11px] text-cobalt-deep flex items-center gap-2">
                {r.not}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>

        <div className="border-2 border-ink-black">
          <div className="border-b-2 border-ink-black px-[18px] py-2 bg-grain-fill font-mono text-[11px]
                          font-bold uppercase tracking-[.14em] text-ink-black/70">{k.atifBaslik}</div>
          <pre className="m-0 bg-ink-black text-paper-base px-[18px] py-4 overflow-x-auto
                          font-mono text-[12px] leading-[1.7]">{k.atif}</pre>
        </div>
      </section>
    </>
  );
}
