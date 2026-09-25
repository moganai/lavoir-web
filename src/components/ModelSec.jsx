import React from 'react';
import { useDil } from '../i18n';

// Giris kutusunun hemen altinda iki kucuk, ayri model karti. Secili kart
// kobalt; digerine basinca header ve giris yerinde kalir, altindaki bolumler
// o modelin metinleriyle yeniden cizilir ve adres ?model=tr olur.
const SIRA = ['en', 'tr'];

export default function ModelSec() {
  const { t, model, setModel } = useDil();
  const m = t.modelSec;

  return (
    <nav aria-label={m.et} className="grid grid-cols-2 gap-3 md:gap-4">
      {SIRA.map((k) => {
        const kart = m.kartlar[k];
        const aktif = model === k;
        return (
          <button key={k} type="button" onClick={() => setModel(k)} aria-pressed={aktif}
                  className={`relative text-left border-2 border-ink-black px-3 py-2.5 md:px-4 md:py-3
                              flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 min-w-0 transition-all ${
                    aktif
                      ? 'bg-cobalt-deep text-on-primary shadow-[3px_3px_0_0_#1b211d]'
                      : 'bg-paper-base text-ink-black hover:bg-grain-fill hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1b211d]'
                  }`}>
            <strong className="font-display text-base md:text-lg font-black tracking-tight shrink-0">{kart.ad}</strong>
            <span className={`font-mono text-[10px] md:text-[11px] uppercase tracking-[.1em] min-w-0 ${
              aktif ? 'text-on-primary-container' : 'text-ink-black/60'}`}>
              {kart.dil}<span className="hidden md:inline"> · {kart.enc}</span>
            </span>
            <span className={`hidden sm:inline ml-auto font-mono text-[10px] uppercase tracking-[.1em] font-bold shrink-0 ${
              aktif ? 'text-seafoam-bright' : 'text-cobalt-deep'}`}>
              {aktif ? '●' : '→'}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
