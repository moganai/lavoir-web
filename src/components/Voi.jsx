import React from 'react';
import { useDil, kalin } from '../i18n';
import { Baslik, Paragraf, Kutu } from './Ortak';
import DonguAkis from './DonguAkis';

// Cip turune gore renk: secenek isaretcisi kobalt, slot isaretcisi yesil,
// kullanici mesaji kum rengi. Sabit tokenler ([CLS], [SEP]) soluk.
const CIP = {
  sabit:   'bg-paper-base text-ink-black/45 border-ink-black/30',
  metin:   'bg-paper-base text-ink-black border-ink-black',
  secenek: 'bg-cobalt-deep text-on-primary border-ink-black font-bold',
  slot:    'bg-secondary text-on-primary border-ink-black font-bold',
  mesaj:   'bg-[#ead9c9] text-ink-black border-[#7a4a2b]',
};

export default function Voi() {
  const { t } = useDil();
  const v = t.voi;

  return (
    <section id="voi" className="flex flex-col gap-6 min-w-0">
      <Baslik>{v.baslik}</Baslik>
      <Paragraf>{kalin(v.p1)}</Paragraf>

      <Kutu baslik={v.sekansBaslik} alt={v.sekansAlt}>
        <div className="bg-paper-base px-[18px] py-5 flex flex-wrap gap-[6px]">
          {v.sekans.map((c, i) => (
            <span key={i} className={`font-mono text-[12px] px-2 py-1 border-2 whitespace-nowrap ${CIP[c.t]}`}>
              {c.m}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-black border-t-2 border-ink-black">
          {['secenek', 'slot', 'mesaj'].map((k) => (
            <div key={k} className="bg-paper-base px-[18px] py-3 flex items-center gap-2">
              <span className={`w-3 h-3 border-2 shrink-0 ${CIP[k]}`} />
              <span className="font-mono text-[11px] text-ink-black/70">{v.lejant[k]}</span>
            </div>
          ))}
        </div>
      </Kutu>

      <Kutu baslik={v.kuralBaslik} alt={v.kuralAlt} dipnot={v.kuralDipnot}>
        <pre className="m-0 bg-ink-black text-paper-base px-[18px] py-5 overflow-x-auto
                        font-mono text-[13px] leading-[1.9]">
          {v.kural.map(([sol, sag], i) => (
            <div key={i}>
              <span className={i === 0 ? '' : 'text-seafoam-bright'}>{sol}</span>
              {'  '}
              <span className={sag.startsWith('#') ? 'text-paper-base/45' : 'text-tertiary-fixed-dim'}>{sag}</span>
            </div>
          ))}
        </pre>
      </Kutu>

      <Paragraf>{kalin(v.pGini)}</Paragraf>

      <Kutu baslik={v.kart.baslik} alt={v.kart.alt} dipnot={v.kart.dipnot}>
        <DonguAkis />
      </Kutu>

      <Paragraf>{kalin(v.p2)}</Paragraf>
    </section>
  );
}
