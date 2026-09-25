// Tasarim aracinda yazilan sahne animasyonlarinin ortak araclari. Sahneler
// yalnizca T'den (saniye) cizilir; bu dosyadaki her sey saf fonksiyon.

export const Easing = {
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

export const HEAD = "'Hanken Grotesk', system-ui, sans-serif";
export const SANS = "'IBM Plex Sans', system-ui, sans-serif";
export const MONO = "'IBM Plex Mono', ui-monospace, monospace";

export const C = {
  bg: '#f4f5f2', bg2: '#e9ece6', ink: '#1b211d', cobalt: '#254a96', green: '#006c48',
  greenLight: '#cdf0e0', greenBright: '#52c994', sand: '#ead9c9', sandLine: '#7a4a2b',
  peach: '#ffb68a', red: '#ba1a1a', muted: '#434652',
};
export const B = `2px solid ${C.ink}`;

export const c01 = (v) => Math.max(0, Math.min(1, v));
export const lerp = (a, b, e) => a + (b - a) * e;

export const MOTION = {
  enter: (T, s, d = 0.6) => Easing.easeOutCubic(c01((T - s) / d)),
  move: (T, s, d = 1) => Easing.easeInOutCubic(c01((T - s) / d)),
  pop: (T, s, d = 0.5) => Easing.easeOutBack(c01((T - s) / d)),
};

// times[i] aninda i. durumdan i+1'e dur saniyede gecis.
export function blend(T, times, dur) {
  for (let i = 0; i < times.length; i++) {
    if (T < times[i]) return { a: i, b: i, e: 0 };
    if (T < times[i] + dur) return { a: i, b: i + 1, e: MOTION.move(T, times[i], dur) };
  }
  return { a: times.length, b: times.length, e: 0 };
}

// Sahne listesinden baslangic zamanlari (CUES) ve toplam sure.
export function zamanCizelgesi(sahneler) {
  const cues = {};
  let t = 0;
  for (const s of sahneler) { cues[s.name] = t; t += s.dur; }
  return { cues, toplam: t };
}
