import React from 'react';

// Ana sitedeki kobalt bolum etiketi.
export function Baslik({ children }) {
  return (
    <div className="bg-cobalt-deep text-on-primary px-4 py-2 border-2 border-ink-black
                    inline-block self-start relative slash-deco">
      <h2 className="font-display text-base md:text-lg font-bold uppercase tracking-tight">{children}</h2>
    </div>
  );
}

export function Paragraf({ children }) {
  return <p className="font-sans text-base text-on-surface-variant leading-relaxed max-w-3xl">{children}</p>;
}

// Basligi ve istege bagli dipnotu olan panel (ana sitedeki kutu()).
export function Kutu({ baslik, alt, dipnot, children }) {
  return (
    <div className="border-2 border-ink-black bg-grain-fill min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2
                      border-b-2 border-ink-black px-[18px] py-3">
        <h3 className="font-display text-base font-bold uppercase text-ink-black">{baslik}</h3>
        {alt && <span className="font-mono text-xs text-ink-black/70">{alt}</span>}
      </div>
      {children}
      {dipnot && (
        <p className="border-t-2 border-ink-black px-[18px] py-3 m-0 font-mono text-[11px]
                      text-ink-black/65 leading-relaxed">{dipnot}</p>
      )}
    </div>
  );
}
