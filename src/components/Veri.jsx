import React from 'react';
import { useDil, kalin } from '../i18n';
import { KUNYE } from '../veri/sonuclar';
import { Baslik, Paragraf, Kutu } from './Ortak';

export default function Veri() {
  const { t } = useDil();
  const v = t.veri;

  return (
    <section id="veri" className="flex flex-col gap-6 min-w-0">
      <Baslik>{v.baslik}</Baslik>
      <Paragraf>{v.p1}</Paragraf>

      {/* profil -> mesaj -> soru-cevap hatti (ana sitedeki donusum hatti gibi) */}
      <Kutu baslik={v.hatBaslik} alt={v.hatAlt}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch bg-ink-black gap-px">
          {v.hat.map((a, i) => (
            <React.Fragment key={a.et}>
              {i > 0 && (
                <div className="bg-paper-base px-2 py-1 flex items-center justify-center font-mono
                                text-[15px] font-bold text-cobalt-deep">
                  <span className="md:hidden">↓</span><span className="hidden md:inline">›</span>
                </div>
              )}
              <div className="bg-paper-base px-[18px] py-5 flex flex-col gap-2">
                <span className="font-mono text-[11px] font-bold tracking-[.12em] text-ink-black/55">{a.et}</span>
                <p className="m-0 font-mono text-[13px] leading-[1.6] text-ink-black whitespace-pre-line">{a.v}</p>
                <span className="mt-auto font-mono text-[11px] text-secondary font-bold">{a.not}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Kutu>

      <Paragraf>{kalin(v.p2)}</Paragraf>
      <Paragraf>{kalin(v.p3)}</Paragraf>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink-black border-2 border-ink-black">
        {v.kunye(KUNYE).map((g) => (
          <div key={g.k} className="bg-paper-base px-4 py-5 flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-black/55">{g.k}</span>
            <strong className="font-mono text-sm font-bold text-ink-black">{g.v}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
