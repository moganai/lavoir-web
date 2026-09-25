import React from 'react';
import { useDil, kalin } from '../i18n';
import { MODEL_AD, MODEL_AD_TR, MOGANBERT_HF } from '../sabitler';
import { Baslik, Paragraf, Kutu } from './Ortak';

// Yalnizca LAVOIR-TR sayfasinda: encoder'in bizim MoganBERT-TR oldugunu one
// cikaran bolum ve Ingilizce surumle yan yana kunye.
const th = 'p-3 border-b-2 border-ink-black font-mono text-xs uppercase font-bold';

export default function MoganBert() {
  const { t } = useDil();
  const b = t.moganbert;

  return (
    <section id="moganbert" className="flex flex-col gap-6 min-w-0">
      <Baslik>{b.baslik}</Baslik>
      <Paragraf>
        {b.p1[0]}
        <a href={MOGANBERT_HF} target="_blank" rel="noopener noreferrer"
           className="font-bold text-cobalt-deep underline decoration-2 underline-offset-4">{b.p1[1]}</a>
        {b.p1[2]}
      </Paragraf>
      <Paragraf>{kalin(b.p2)}</Paragraf>

      <Kutu baslik={b.kiyasBaslik} alt={b.kiyasAlt} dipnot={b.kiyasDipnot}>
        <div className="w-full overflow-x-auto bg-paper-base">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-ink-black/[0.04]">
                <th className={`${th} border-r-2`}>{b.thOzellik}</th>
                <th className={`${th} border-r-2 text-center`}>{MODEL_AD}</th>
                <th className={`${th} text-center text-cobalt-deep`}>{MODEL_AD_TR}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {b.kiyas.map(([ad, en, tr], i) => (
                <tr key={ad} className="border-b border-ink-black/20">
                  <td className="p-3 border-r-2 border-ink-black font-sans">{ad}</td>
                  <td className="p-3 border-r-2 border-ink-black text-center text-ink-black/70">{en}</td>
                  <td className={`p-3 text-center bg-ink-black/[0.05] ${i === 0 ? 'font-bold text-cobalt-deep' : 'font-bold'}`}>{tr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Kutu>

      <Paragraf>{b.p3[0]}</Paragraf>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink-black border-2 border-ink-black">
        {b.baglantilar.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
             className="group bg-paper-base px-[18px] py-3 flex items-center justify-between gap-2 no-underline
                        hover:bg-grain-fill transition-colors">
            <span className="font-mono text-[12px] font-bold uppercase text-cobalt-deep">{l.ad}</span>
            <span className="font-mono text-cobalt-deep transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
