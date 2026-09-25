import React from 'react';
import { useDil, useSayi } from '../i18n';
import Oynatici from './sahne/Oynatici';
import { HEAD, SANS, MONO, C, B, c01, lerp, MOTION, blend, zamanCizelgesi } from './sahne/ortak';
import { DONGU } from '../veri/ornekler';

// "VOI basligi ne zaman devreye girer" animasyonu. Soru sorma dongusunu
// kutu-ok semasi olarak gosterir: mesaj -> model (p + VOI) -> VOI > c? ->
// slotu sor -> cevap eklenip model yeniden calisir; VOI esigin altina
// dusunce (ya da soru hakki bitince) cikis: karar ver ya da devret.
// Sayilar gercek model ciktisi; ornek veri/ornekler.js'te, secili modele gore
// (EN telecom_support/00118, TR sgk_işlemleri/00115).

// ---- zaman cizelgesi ----
const SAHNELER = [
  { name: 'Intro', dur: 2.5 },  // paneller acilir
  { name: 'Loop0', dur: 8.5 },  // ilk mesaj, request sorulur
  { name: 'Loop1', dur: 8.5 },  // cevap eklendi, location sorulur
  { name: 'Loop2', dur: 7 },    // VOI esigin altinda: cikis, karar
  { name: 'Ozet', dur: 7 },     // basligin ne zaman devreye girdigi
];
const { cues: CUES, toplam: TOPLAM } = zamanCizelgesi(SAHNELER);
const LOOPS = [CUES.Loop0, CUES.Loop1, CUES.Loop2];
// Hareket azaltma tercihinde: karar verilmis, butun sema gorunur.
const DURGUN_KARE = CUES.Loop2 + 6.2;

// Dongu icindeki adimlarin loop basina gore zamani (sn).
const AN = { mesaj: 0, model: 1.4, kontrol: 3.2, sor: 4.6, donus: 5.8, donusBitis: 8.0 };
const CIKIS = { kontrol: 4.2, karar: 5.2 };  // son dongude (Loop2) cikis adimlari

const C_ESIK = 0.05;
const BUTCE = 2;

const VMAX = 0.4;
// Secili modelin ornegi; bilesenler useO() ile okur.
const OrnekCtx = React.createContext(null);
const useO = () => React.useContext(OrnekCtx);

// ---- yerlesim ----
// Genis (1920x1080) ve dar (640 genislik) sahne icin kutu ve ok koordinatlari.
const GENIS = {
  w: 1920, h: 1080,
  baslik: { x: 60, y: 30, w: 1800, h: 80 },
  dongu: { x: 60, y: 140, w: 1800, h: 340 },
  cikis: { x: 60, y: 510, w: 1800, h: 190 },
  kutu: {
    mesaj: { x: 100, y: 210, w: 360, h: 96 },
    model: { x: 540, y: 210, w: 360, h: 96 },
    kontrol: { x: 980, y: 210, w: 360, h: 96 },
    sor: { x: 1420, y: 210, w: 360, h: 96 },
    hkontrol: { x: 980, y: 580, w: 360, h: 96 },
    karar: { x: 540, y: 580, w: 360, h: 96 },
    devret: { x: 1420, y: 580, w: 360, h: 96 },
  },
  ok: {
    mesajModel: [[460, 258], [540, 258]],
    modelKontrol: [[900, 258], [980, 258]],
    kontrolSor: [[1340, 258], [1420, 258]],
    donus: [[1600, 306], [1600, 400], [280, 400], [280, 306]],
    cikis: [[1160, 306], [1160, 580]],
    hkKarar: [[980, 628], [900, 628]],
    hkDevret: [[1340, 628], [1420, 628]],
  },
  etiket: {
    evet: { x: 1352, y: 216 }, hayir: { x: 1174, y: 318 },
    hkHayir: { x: 912, y: 588 }, hkEvet: { x: 1352, y: 588 },
    donus: { x: 940, y: 400 },
  },
  durum: {
    sohbet: { x: 60, y: 730, w: 600, h: 320 },
    olasilik: { x: 690, y: 730, w: 570, h: 320 },
    slot: { x: 1290, y: 730, w: 570, h: 320 },
  },
};
const DAR = {
  w: 640, h: 2210,
  baslik: { x: 20, y: 20, w: 600, h: 130 },
  dongu: { x: 20, y: 170, w: 600, h: 660 },
  cikis: { x: 20, y: 860, w: 600, h: 340 },
  kutu: {
    mesaj: { x: 90, y: 240, w: 500, h: 96 },
    model: { x: 90, y: 376, w: 500, h: 96 },
    kontrol: { x: 90, y: 512, w: 500, h: 96 },
    sor: { x: 90, y: 648, w: 500, h: 96 },
    hkontrol: { x: 90, y: 920, w: 500, h: 96 },
    karar: { x: 90, y: 1076, w: 240, h: 96 },
    devret: { x: 350, y: 1076, w: 240, h: 96 },
  },
  ok: {
    mesajModel: [[340, 336], [340, 376]],
    modelKontrol: [[340, 472], [340, 512]],
    kontrolSor: [[340, 608], [340, 648]],
    donus: [[340, 744], [340, 790], [50, 790], [50, 288], [90, 288]],
    cikis: [[590, 560], [608, 560], [608, 968], [590, 968]],
    hkKarar: [[210, 1016], [210, 1076]],
    hkDevret: [[470, 1016], [470, 1076]],
  },
  etiket: {
    evet: { x: 352, y: 614 }, hayir: { x: 520, y: 484 },
    hkHayir: { x: 222, y: 1030 }, hkEvet: { x: 482, y: 1030 },
    donus: { x: 195, y: 790 },
  },
  durum: {
    sohbet: { x: 20, y: 1230, w: 600, h: 330 },
    olasilik: { x: 20, y: 1590, w: 600, h: 230 },
    slot: { x: 20, y: 1850, w: 600, h: 330 },
  },
};

// ---- zamanla degisen durum ----
function hangiLoop(T) {
  if (T >= CUES.Loop2) return 2;
  if (T >= CUES.Loop1) return 1;
  if (T >= CUES.Loop0) return 0;
  return -1;
}

// O an etkin kutu (yesil dolgu) ve etkin ok.
function etkin(T) {
  const k = hangiLoop(T);
  if (k < 0) return { kutu: null, ok: null };
  const t = T - LOOPS[k];
  if (k === 2) {
    if (t >= CIKIS.karar) return { kutu: 'karar', ok: 'hkKarar' };
    if (t >= CIKIS.kontrol) return { kutu: 'hkontrol', ok: 'cikis' };
  }
  if (k < 2 && t >= AN.donus) return { kutu: null, ok: 'donus' };
  if (k < 2 && t >= AN.sor) return { kutu: 'sor', ok: 'kontrolSor' };
  if (t >= AN.kontrol) return { kutu: 'kontrol', ok: 'modelKontrol' };
  if (t >= AN.model) return { kutu: 'model', ok: 'mesajModel' };
  return { kutu: 'mesaj', ok: k > 0 ? 'donus' : null };
}

// Sorulmus slotlar ve kullanilan soru hakki.
const sorulduAn = (i) => LOOPS[i] + AN.sor;
const soruSayisi = (T, sorular) => sorular.filter((_, i) => T >= sorulduAn(i)).length;

// ---- dil ----
// Etiketler aktif dilde; modelin kendi girdi/ciktilari (mesajlar, sorular,
// birim ve slot adlari) Ingilizce kalir. Sayilar dile gore (TR 0,366).
function useM() {
  const { t, dil } = useDil();
  const n = useSayi();
  const pct = (v, d = 1) => (dil === 'tr' ? `%${n(v * 100, d)}` : `${n(v * 100, d)}%`);
  return { M: t.voi.ornek.m, n, pct };
}

// ---- kucuk parcalar ----
function Label({ children, color, style }) {
  return <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: color || C.ink, whiteSpace: 'nowrap', ...style }}>{children}</div>;
}
function Chip({ children, color, fill, text, style }) {
  return <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', border: `2px solid ${color || C.ink}`, background: fill || C.bg, color: text || color || C.ink, padding: '3px 10px', whiteSpace: 'nowrap', ...style }}>{children}</div>;
}
function SlashDeco({ color }) {
  return <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderTop: `18px solid ${color || C.ink}`, borderLeft: '18px solid transparent', zIndex: 3 }}></div>;
}
function Panel({ r, title, color, right, children, e = 1 }) {
  return (
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, border: B, background: C.bg, boxSizing: 'border-box', overflow: 'hidden', opacity: e, transform: `translateY(${(1 - e) * 16}px)` }}>
      <div style={{ height: 44, boxSizing: 'border-box', background: C.bg2, borderBottom: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px 0 16px' }}>
        <Label color={color}>{title}</Label>
        {right}
      </div>
      <SlashDeco color={color} />
      {children}
    </div>
  );
}

// Semadaki kutu. Etkinken yesil dolgu ve beyaz yazi (gorseldeki MESSAGE gibi).
// formul: baslik matematik iceriyorsa (1 − max p) buyuk harfe cevrilmez.
function Blok({ r, baslik, alt, aktif, soluk, formul, e = 1, vurgu = C.green }) {
  return (
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, boxSizing: 'border-box', border: `2px solid ${C.ink}`, background: aktif ? vurgu : C.bg, color: aktif ? C.bg : C.ink, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, zIndex: 2, opacity: e * (soluk ? 0.45 : 1), transform: `scale(${aktif ? 1.02 : 1})`, transition: 'none' }}>
      <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, letterSpacing: 1, textTransform: formul ? 'none' : 'uppercase', whiteSpace: 'nowrap' }}>{baslik}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, color: aktif ? C.bg : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alt}</div>
    </div>
  );
}

// Coklu dogru parcali ok. kopru: arkasina zemin renginde kalin cizgi (baska
// bir cizgiyi ya da panel kenarini keserken bosluk birakir).
function Ok({ pts, aktif, kopru, e = 1 }) {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const L = 16, W = 9;
  const uc = [
    [b[0], b[1]],
    [b[0] - L * Math.cos(ang) + W * Math.sin(ang), b[1] - L * Math.sin(ang) - W * Math.cos(ang)],
    [b[0] - L * Math.cos(ang) - W * Math.sin(ang), b[1] - L * Math.sin(ang) + W * Math.cos(ang)],
  ];
  const renk = aktif ? C.green : C.ink;
  return (
    <g opacity={e}>
      {kopru ? <path d={d} fill="none" stroke={C.bg} strokeWidth={16} /> : null}
      <path d={d} fill="none" stroke={renk} strokeWidth={aktif ? 5 : 3} strokeLinejoin="miter" />
      <polygon points={uc.map((p) => p.join(',')).join(' ')} fill={renk} />
    </g>
  );
}

// Coklu dogru uzerinde f (0..1) oraninda nokta.
function yoldaNokta(pts, f) {
  const seg = [];
  let top = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l); top += l;
  }
  let kalan = c01(f) * top;
  for (let i = 0; i < seg.length; i++) {
    if (kalan <= seg[i]) {
      const u = seg[i] ? kalan / seg[i] : 0;
      return [lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)];
    }
    kalan -= seg[i];
  }
  return pts[pts.length - 1];
}

function OkEtiketi({ p, children, e, color = C.ink }) {
  return <div style={{ position: 'absolute', left: p.x, top: p.y, fontFamily: MONO, fontSize: 20, fontWeight: 700, letterSpacing: 1, color, opacity: e, zIndex: 3 }}>{children}</div>;
}

// ---- sahne ----
function Baslik({ T, G, dar }) {
  const { M } = useM();
  const e = MOTION.enter(T, 0.1, 0.8);
  const k = hangiLoop(T);
  const n = soruSayisi(T, useO().sorular);
  const donguler = (
    <div style={{ display: 'flex', background: C.ink, gap: 2, border: B }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ fontFamily: MONO, fontSize: dar ? 18 : 22, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 14px', background: i === k ? C.ink : C.bg, color: i === k ? C.bg : i < k ? C.ink : C.muted }}>{M.dongu} {i}</div>
      ))}
    </div>
  );
  const butce = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Label color={C.muted} style={{ fontSize: dar ? 18 : 22 }}>{M.sorular}</Label>
      {Array.from({ length: BUTCE }).map((_, i) => (
        <div key={i} style={{ width: 20, height: 20, border: B, background: i < n ? C.green : C.bg }}></div>
      ))}
      <Label color={C.muted} style={{ fontSize: dar ? 18 : 22 }}>{n}/{BUTCE}</Label>
    </div>
  );
  const r = G.baslik;
  if (dar) {
    return (
      <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, borderBottom: B, opacity: e }}>
        <div style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05 }}>{M.baslik}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{donguler}{butce}</div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: B, opacity: e, transform: `translateY(${(1 - e) * -20}px)` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
        <div style={{ fontFamily: HEAD, fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>{M.baslik}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>{butce}{donguler}</div>
    </div>
  );
}

function Sema({ T, G, dar }) {
  const { M, n } = useM();
  const { sorular: SORULAR, kazanan, kazananP } = useO();
  const c = n(C_ESIK, 2);
  const k = hangiLoop(T);
  const t = k >= 0 ? T - LOOPS[k] : -1;
  const { kutu: ak, ok: aok } = etkin(T);
  const pE = MOTION.enter(T, 0.4, 0.7);
  const cE = MOTION.enter(T, 0.9, 0.7);

  // Kutularin alt satirlari o anki donguye gore.
  const mesajAlt = k <= 0 ? M.ilkMesaj : M.cevapEklendi;
  const kontrolAlt = k < 0 || t < AN.kontrol ? M.esik(c)
    : k < 2 ? `${SORULAR[k].slot} ${n(SORULAR[k].voi, 3)} → ${M.evetK}` : `max ${n(0, 3)} → ${M.hayirK}`;
  const sorAlt = k >= 0 && k < 2 && t >= AN.sor ? `${SORULAR[k].slot} · ${M.sabitSoru}` : M.sabitSoru;
  const karar = k === 2 && t >= CIKIS.karar;
  const hk = k === 2 && t >= CIKIS.kontrol;

  // Donus yolunda ilerleyen nokta.
  const donusF = k >= 0 && k < 2 ? c01((t - AN.donus) / (AN.donusBitis - AN.donus)) : 0;
  const nokta = donusF > 0 && donusF < 1 ? yoldaNokta(G.ok.donus, donusF) : null;

  const evetE = k >= 0 && k < 2 && t >= AN.kontrol ? MOTION.enter(T, LOOPS[k] + AN.kontrol, 0.3) : 0;
  const hayirE = k === 2 && t >= AN.kontrol ? MOTION.enter(T, LOOPS[2] + AN.kontrol, 0.3) : 0;
  const hkE = hk ? MOTION.enter(T, LOOPS[2] + CIKIS.kontrol + 0.3, 0.3) : 0;

  return (
    <>
      <Panel r={G.dongu} title={dar ? M.donguPanelDar : M.donguPanel} color={C.green} e={pE}
             right={<Chip color={C.green} text={C.green}>{k < 0 ? M.hazir : `${M.dongu} ${k}`}</Chip>} />
      <Panel r={G.cikis} title={dar ? M.cikisDar(c, BUTCE) : M.cikis(c, BUTCE)} color={C.cobalt} e={cE} />

      <svg width={G.w} height={G.h} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, overflow: 'visible' }}>
        <Ok pts={G.ok.mesajModel} aktif={aok === 'mesajModel'} e={pE} />
        <Ok pts={G.ok.modelKontrol} aktif={aok === 'modelKontrol'} e={pE} />
        <Ok pts={G.ok.kontrolSor} aktif={aok === 'kontrolSor'} e={pE} />
        <Ok pts={G.ok.donus} aktif={aok === 'donus'} e={pE} />
        <Ok pts={G.ok.cikis} aktif={aok === 'cikis'} kopru e={cE} />
        <Ok pts={G.ok.hkKarar} aktif={aok === 'hkKarar'} e={cE} />
        <Ok pts={G.ok.hkDevret} aktif={false} e={cE} />
        {nokta ? <rect x={nokta[0] - 9} y={nokta[1] - 9} width={18} height={18} fill={C.green} stroke={C.ink} strokeWidth={2} /> : null}
      </svg>

      <Blok r={G.kutu.mesaj} baslik={M.mesaj} alt={mesajAlt} aktif={ak === 'mesaj'} e={pE} />
      <Blok r={G.kutu.model} baslik={M.model} alt={M.tekGecis} aktif={ak === 'model'} e={pE} />
      <Blok r={G.kutu.kontrol} baslik={`VOI > ${c}?`} alt={kontrolAlt} aktif={ak === 'kontrol'} e={pE} />
      <Blok r={G.kutu.sor} baslik={M.slotuSor} alt={sorAlt} aktif={ak === 'sor'} e={pE} />
      <Blok r={G.kutu.hkontrol} baslik="1 − max p > c_h?" formul alt={hk ? `1 − ${n(1, 2)} = ${n(0, 2)} → ${M.hayirK}` : M.haalaEmin} aktif={ak === 'hkontrol'} vurgu={C.cobalt} e={cE} />
      <Blok r={G.kutu.karar} baslik={M.kararVer} alt={karar ? (dar || kazanan.length > 12 ? `${kazanan} ✓` : `${kazanan} · p = ${n(kazananP, 2)} ✓`) : 'argmax p'} aktif={karar} vurgu={C.cobalt} e={cE} />
      <Blok r={G.kutu.devret} baslik={M.devret} alt={M.insana} soluk={karar} e={cE} />

      <OkEtiketi p={G.etiket.evet} e={evetE} color={C.green}>{M.EVET}</OkEtiketi>
      <OkEtiketi p={G.etiket.hayir} e={hayirE} color={C.cobalt}>{M.HAYIR}</OkEtiketi>
      <OkEtiketi p={G.etiket.hkHayir} e={hkE} color={C.cobalt}>{M.HAYIR}</OkEtiketi>
      <OkEtiketi p={G.etiket.hkEvet} e={cE * 0.5}>{M.EVET}</OkEtiketi>

      {/* donus yolunun uzerindeki etiket */}
      <div style={{ position: 'absolute', left: G.etiket.donus.x, top: G.etiket.donus.y, transform: 'translate(-50%, -50%)', zIndex: 3, opacity: pE }}>
        <div style={{ fontFamily: MONO, fontSize: dar ? 18 : 22, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', background: aok === 'donus' ? C.greenLight : C.bg, border: `2px solid ${aok === 'donus' ? C.green : C.ink}`, padding: '4px 12px', whiteSpace: 'nowrap' }}>
          {dar ? M.donusDar : M.donus}
        </div>
      </div>

    </>
  );
}

function Durum({ T, G }) {
  const { M, n, pct } = useM();
  const { secenekler: OPTIONS, p: PROBS, slotlar: SLOTS, voi: VOI, sorular: SORULAR, ilkMesaj: ILK_MESAJ, secSutun, slotSutun } = useO();
  const e = MOTION.enter(T, 1.2, 0.7);
  const vb = blend(T, LOOPS.map((l) => l + AN.model + 0.2), 1.0);
  const pb = vb;
  const hazir = T >= LOOPS[0] + AN.model + 0.2;

  const mesajlar = [
    { rol: 'user', metin: ILK_MESAJ, at: LOOPS[0] + 0.2 },
    ...SORULAR.flatMap((s, i) => [
      { rol: 'agent', metin: s.q, at: LOOPS[i] + AN.sor + 0.2 },
      { rol: 'user', metin: s.a, at: LOOPS[i] + AN.donus + 0.6, yaz: true },
    ]),
  ];

  const top3 = OPTIONS.map((id) => ({ id, p: lerp(PROBS[pb.a][id], PROBS[pb.b][id], pb.e) }))
    .sort((x, y) => y.p - x.p).slice(0, 3);
  const karar = T >= LOOPS[2] + CIKIS.karar;

  return (
    <>
      <Panel r={G.durum.sohbet} title={M.konusma} e={e}
             right={<div style={{ display: 'flex', gap: 8 }}><Chip color={C.sandLine} fill={C.sand} text={C.ink}>{M.musteri}</Chip><Chip color={C.green} text={C.green}>{M.model}</Chip></div>}>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mesajlar.map((m, i) => {
            const me = MOTION.enter(T, m.at, 0.5);
            const ajan = m.rol === 'agent';
            const n = m.yaz ? Math.floor(m.metin.length * c01((T - m.at - 0.1) / 0.8)) : m.metin.length;
            return (
              <div key={i} style={{ maxHeight: 90 * me, opacity: me, overflow: 'hidden', display: 'flex', justifyContent: ajan ? 'flex-end' : 'flex-start', flexShrink: 0 }}>
                <div style={{ maxWidth: '88%', fontFamily: SANS, fontSize: 20, lineHeight: 1.3, padding: '3px 12px', background: ajan ? C.bg : C.sand, border: `2px solid ${ajan ? C.green : C.sandLine}` }}>
                  {m.metin.slice(0, n)}{m.yaz && n < m.metin.length && T > m.at ? <span style={{ opacity: 0.5 }}>▍</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel r={G.durum.olasilik} title={M.pIlk3} color={C.cobalt} e={e}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: C.ink }}>
          {top3.map((o, i) => {
            const kazanan = karar && i === 0;
            return (
              <div key={i} style={{ height: 56, background: kazanan ? C.greenLight : C.bg, display: 'grid', gridTemplateColumns: `${secSutun}px minmax(0,1fr) 100px`, gap: 14, alignItems: 'center', padding: '0 18px' }}>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: kazanan ? C.cobalt : C.ink, whiteSpace: 'nowrap' }}>{o.id}{kazanan ? ' ✓' : ''}</div>
                <div style={{ position: 'relative', height: 16, border: B, background: C.bg, boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c01(o.p) * 100}%`, background: C.cobalt }}></div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: HEAD, fontSize: 26, fontWeight: 900, letterSpacing: -1, color: C.cobalt }}>{hazir ? pct(o.p, 1) : '—'}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel r={G.durum.slot} title={M.slotVoi} color={C.green} e={e}
             right={<Label color={C.green} style={{ fontSize: 20 }}>c = {n(C_ESIK, 2)}</Label>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: C.ink }}>
          {SLOTS.map((s) => {
            const v = lerp(VOI[vb.a][s], VOI[vb.b][s], vb.e);
            const i = SORULAR.findIndex((q) => q.slot === s);
            const soruldu = i >= 0 && T >= sorulduAn(i);
            const ust = v > C_ESIK;
            const esikX = (C_ESIK / VMAX) * 100;
            return (
              <div key={s} style={{ height: 52, background: soruldu ? C.bg2 : C.bg, display: 'grid', gridTemplateColumns: `${slotSutun}px minmax(0,1fr) 100px`, gap: 14, alignItems: 'center', padding: '0 18px' }}>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: soruldu || ust ? C.green : C.ink, whiteSpace: 'nowrap' }}>{s}</div>
                <div style={{ position: 'relative', height: 16, border: B, background: C.bg, boxSizing: 'border-box', opacity: soruldu ? 0.35 : 1 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c01(v / VMAX) * 100}%`, background: ust ? C.green : C.bg2 }}></div>
                  <div style={{ position: 'absolute', left: `${esikX}%`, top: -7, bottom: -7, width: 2, background: C.ink }}></div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: MONO, fontSize: 20, fontWeight: 600, color: ust ? C.green : C.muted, whiteSpace: 'nowrap' }}>
                  {soruldu ? M.soruldu : hazir ? n(v, 3) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

function Madde({ n, baslik, metin, e, dar }) {
  return (
    <div style={{ flex: 1, borderTop: `4px solid ${C.green}`, paddingTop: 16, opacity: c01(e * 1.5), transform: `translateY(${(1 - c01(e)) * 20}px)` }}>
      <Label color={C.green}>{n}</Label>
      <div style={{ fontFamily: HEAD, fontSize: dar ? 32 : 36, fontWeight: 800, letterSpacing: -1, marginTop: 6, lineHeight: 1.1 }}>{baslik}</div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted, marginTop: 8, lineHeight: 1.35 }}>{metin}</div>
    </div>
  );
}

function Ozet({ T, dar }) {
  const { M, n } = useM();
  const maddeler = M.madde(n(C_ESIK, 2), BUTCE);
  const s = CUES.Ozet;
  const inE = MOTION.enter(T, s, 0.6);
  // Outro yok: dongu sonunda solar ve bos Intro karesine baglanir.
  const out = 1 - MOTION.enter(T, TOPLAM - 0.7, 0.6);
  const bE = MOTION.enter(T, s + 0.3, 0.6);
  const m1 = MOTION.enter(T, s + 1.0, 0.5), m2 = MOTION.enter(T, s + 1.6, 0.5), m3 = MOTION.enter(T, s + 2.2, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: inE * out, padding: dar ? '80px 32px' : '120px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 56, zIndex: 10 }}>
      <div style={{ opacity: bE, transform: `translateY(${(1 - bE) * 20}px)` }}>
        <Label color={C.green}>{M.ozetEt}</Label>
        <div style={{ fontFamily: HEAD, fontSize: dar ? 52 : 76, fontWeight: 900, letterSpacing: dar ? -2 : -3, lineHeight: 1.02, marginTop: 12 }}>{M.ozetBaslik}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: dar ? 'column' : 'row', gap: 40 }}>
        {[m1, m2, m3].map((me, i) => (
          <Madde key={i} e={me} dar={dar} n={maddeler[i].n} baslik={maddeler[i].baslik} metin={maddeler[i].metin} />
        ))}
      </div>
    </div>
  );
}

function Piece({ T, dar }) {
  const G = dar ? DAR : GENIS;
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, color: C.ink, fontFamily: SANS, overflow: 'hidden' }}>
      <Baslik T={T} G={G} dar={dar} />
      <Sema T={T} G={G} dar={dar} />
      <Durum T={T} G={G} />
      <Ozet T={T} dar={dar} />
    </div>
  );
}

export default function DonguAkis() {
  const { t, model } = useDil();
  const o = t.voi.ornek;
  return (
    <OrnekCtx.Provider value={DONGU[model]}>
      <Oynatici key={model} sahneler={SAHNELER} cues={CUES} toplam={TOPLAM}
                genis={{ w: GENIS.w, h: GENIS.h }} dar={{ w: DAR.w, h: DAR.h, esik: 860, max: 560 }}
                durgunKare={DURGUN_KARE} sahneAd={o.sahne} etiket={t.voi.kart.etiket}>
        {(T, dar) => <Piece T={T} dar={dar} />}
      </Oynatici>
    </OrnekCtx.Provider>
  );
}
