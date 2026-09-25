import React, { useEffect, useState } from 'react';
import { useDil, MODEL_AD } from '../i18n';

// Tek sayfa: menu bolum capalarina gidiyor.
const CAPALAR = ['giris', 'laya', 'voi', 'veri', 'sonuc', 'kaynak'];

export default function Ust() {
  const { dil, setDil, t } = useDil();
  const [hash, setHash] = useState(() => window.location.hash || '#giris');

  useEffect(() => {
    const dinle = () => setHash(window.location.hash || '#giris');
    window.addEventListener('hashchange', dinle);
    return () => window.removeEventListener('hashchange', dinle);
  }, []);

  return (
    <header className="bg-paper-base top-0 sticky border-b-2 border-ink-black z-40">
      <div className="flex justify-between items-center w-full px-6 h-16 max-w-[1100px] mx-auto gap-4">
        <a href="#giris" className="flex items-baseline gap-2 no-underline shrink-0">
          <span className="font-display font-black text-2xl text-ink-black tracking-tighter">MoganAI</span>
          <span className="font-mono text-xs font-bold uppercase text-cobalt-deep">/ {MODEL_AD}</span>
        </a>

        <nav className="hidden md:flex gap-5 items-center">
          {CAPALAR.map((c) => {
            const h = '#' + c;
            const aktif = h === hash;
            return (
              <a key={c} href={h} aria-current={aktif ? 'page' : undefined}
                 className={aktif
                   ? 'text-cobalt-deep border-b-2 border-cobalt-deep pb-0.5 font-mono text-[13px] uppercase font-semibold whitespace-nowrap'
                   : 'text-ink-black/70 hover:text-ink-black hover:bg-grain-fill transition-colors font-mono text-[13px] uppercase pb-0.5 whitespace-nowrap'}>
                {t.nav[c]}
              </a>
            );
          })}
        </nav>

        <div className="flex border-2 border-ink-black shrink-0" role="group" aria-label="Language / Dil">
          {[['tr', 'TR'], ['en', 'EN']].map(([k, e]) => (
            <button key={k} type="button" onClick={() => setDil(k)} aria-pressed={dil === k}
                    className={`px-2.5 py-1 font-mono text-[12px] font-bold uppercase transition-colors ${
                      dil === k
                        ? 'bg-ink-black text-paper-base'
                        : 'bg-paper-base text-ink-black/60 hover:bg-grain-fill hover:text-ink-black'
                    }`}>
              {e}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
