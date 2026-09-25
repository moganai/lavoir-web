import React from 'react';
import { useDil, useSayi } from '../i18n';
import Oynatici from './sahne/Oynatici';
import { HEAD, SANS, MONO, C, B, c01, lerp, MOTION, blend, zamanCizelgesi } from './sahne/ortak';
import { KARSILASTIRMA } from '../veri/ornekler';

// "LAVOIR vs Laya" animasyonu: ayni belirsiz mesaj iki modele veriliyor
// (ornek veri/ornekler.js'te, secili modele gore: EN ecommerce_returns/00017,
// TR sgk_işlemleri/00115 ve Laya-multilingual). LAVOIR iki soru sorup dogru birime yonlendiriyor;
// Laya'nin guveni esigin altinda kaliyor ve konusmayi insana devrediyor.
// Tasarim aracindaki surumle ayni; outro cikarildi, dar ekranlar icin dikey
// (640 px) bir yerlesim eklendi.

const SAHNELER = [
  { name: 'Intro', dur: 3 },   // baslik ve iki model paneli ayni girdiyle acilir
  { name: 'Step0', dur: 7 },   // ilk mesaj: LAVOIR seller'i secer, Laya emin degil (0.12) ve devreder
  { name: 'Ask1', dur: 4 },    // LAVOIR saticiyi sorar; musteri "bizim magaza" der
  { name: 'Step1', dur: 6 },   // returns_desk ve logistics yakin, problem sorusu secilir
  { name: 'Ask2', dur: 4 },    // problem sorusu ve "hasarli geldi" cevabi
  { name: 'Step2', dur: 6 },   // VOI esigin altinda, LAVOIR sormayi birakip logistics der
  { name: 'Result', dur: 5 },  // sonuc kartlari: dogru yonlendirme vs devretme
  { name: 'Scope', dur: 8 },   // fark: bilgiyi kendisi topluyor, LLM yok, gereksiz soru yok, siniri
];
const { cues: CUES, toplam: TOPLAM } = zamanCizelgesi(SAHNELER);
// Hareket azaltma tercihinde: iki sonuc karti da gorunur.
const DURGUN_KARE = CUES.Result + 3;

const GENIS = { w: 1920, h: 1080 };
const DAR = { w: 640, h: 2360, esik: 860, max: 560 };

const THRESHOLD = 0.05;
const REORDER = true; // Laya seceneklerini olasiliga gore sirala

// Secili modelin ornegi; bilesenler useO() ile okur.
function hazirla(o) {
  return {
    ...o,
    OPTION_IDS: o.secenekler,
    LAYA_PROBS: o.layaP,
    LAYA_CONF: o.layaGuven,
    LAYA_GUESS: o.layaTahmin,
    LAYA_RANK: [o.secenekler, Object.keys(o.layaP[1])],
    LAVOIR_PROBS: o.bizP,
    WINNER: o.kazanan,
    SLOTS: o.slotlar,
    VOI: o.voi,
    TEXT: o.metin,
  };
}
const OrnekCtx = React.createContext(null);
const useO = () => React.useContext(OrnekCtx);

// Dar sahnede sohbet paneli uzun ilk mesaja yer acmak icin 40 px uzuyor;
// altindaki paneller ayni miktar asagi kayiyor.
const DarCtx = React.createContext(false);
const useDar = () => React.useContext(DarCtx);
const kay = (dar) => (dar ? 40 : 0);

// Etiketler aktif dilde; modelin kendi girdi/ciktilari (mesajlar, sorular,
// birim ve slot adlari) Ingilizce kalir. Sayilar dile gore (TR 0,12).
function useM() {
  const { t, dil } = useDil();
  const n = useSayi();
  const pct = (v, d = 1) => (dil === 'tr' ? `%${n(v * 100, d)}` : `${n(v * 100, d)}%`);
  return { M: t.sorun.ornek.m, n, pct };
}

function Label({ children, color, style }) {
  return <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: color || C.ink, whiteSpace: 'nowrap', ...style }}>{children}</div>;
}
function Chip({ children, color, fill, text, style }) {
  return <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', border: `2px solid ${color || C.ink}`, background: fill || C.bg, color: text || color || C.ink, padding: '3px 10px', whiteSpace: 'nowrap', ...style }}>{children}</div>;
}
function SlashDeco({ color }) {
  return <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderTop: `18px solid ${color || C.ink}`, borderLeft: '18px solid transparent', zIndex: 3 }}></div>;
}
function PanelHead({ title, color, right }) {
  return (
    <div style={{ height: 44, boxSizing: 'border-box', background: C.bg2, borderBottom: B, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px 0 16px', flexShrink: 0 }}>
      <Label color={color}>{title}</Label>
      {right}
    </div>
  );
}
function Panel({ top, height, title, color, right, children, bgInk }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height, border: B, background: bgInk ? C.ink : C.bg, boxSizing: 'border-box', overflow: 'hidden' }}>
      <PanelHead title={title} color={color} right={right} />
      <SlashDeco color={color} />
      {children}
    </div>
  );
}

function Steps({ step, size }) {
  const { M } = useM();
  return (
    <div style={{ display: 'flex', background: C.ink, gap: 2, border: B }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ fontFamily: MONO, fontSize: size, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 14px', background: i === step ? C.ink : C.bg, color: i === step ? C.bg : i < step ? C.ink : C.muted }}>{M.adim} {i}</div>
      ))}
    </div>
  );
}

function Header({ T, c }) {
  const { M } = useM();
  const D = useO();
  const dar = useDar();
  const e = MOTION.enter(T, 0.1, 0.8);
  const step = T < c.Step0 ? -1 : T < c.Step1 ? 0 : T < c.Step2 ? 1 : 2;
  const baslik = (size) => (
    <div style={{ fontFamily: HEAD, fontSize: D.bizAd.length + D.layaBaslik.length > 12 ? size * 0.72 : size, fontWeight: 900, letterSpacing: -2, lineHeight: 1, whiteSpace: 'nowrap' }}>{D.bizAd} <span style={{ color: C.muted, fontWeight: 800 }}>vs</span> {D.layaBaslik}</div>
  );
  if (dar) {
    // Dar sahnede iki satir: baslik, altinda "ayni girdi" ve adimlar.
    return (
      <div style={{ position: 'absolute', left: 20, right: 20, top: 20, height: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, borderBottom: B, opacity: e, transform: `translateY(${(1 - e) * -20}px)` }}>
        {baslik(46)}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label color={C.muted} style={{ fontSize: 18 }}>{M.ayniGirdi}</Label>
          <Steps step={step} size={18} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 30, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: B, opacity: e, transform: `translateY(${(1 - e) * -20}px)` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
        {baslik(52)}
        <Label color={C.muted}>{M.ayniGirdi} · {D.id}</Label>
      </div>
      <Steps step={step} size={22} />
    </div>
  );
}

function SideTitle({ T, name, sub, badge }) {
  const dar = useDar();
  const o = MOTION.enter(T, 1.0, 0.4);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <div style={{ fontFamily: HEAD, fontSize: 42, fontWeight: 900, letterSpacing: -1.5 }}>{name}</div>
        {/* dar sahnede alt etiket rozetle birlikte sigmiyor */}
        {dar ? null : <Label color={C.muted}>{sub}</Label>}
      </div>
      <div style={{ opacity: o }}>{badge}</div>
    </div>
  );
}

function Chat({ T, msgs, height }) {
  const { M } = useM();
  const dar = useDar();
  return (
    <Panel top={64} height={height + kay(dar)} title={M.konusma} right={<div style={{ display: 'flex', gap: 8 }}><Chip color={C.sandLine} fill={C.sand} text={C.ink}>{M.musteri}</Chip><Chip>{M.model}</Chip></div>}>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => {
          const e = MOTION.enter(T, m.at, 0.5);
          if (m.render) return <div key={i} style={{ maxHeight: 80 * e, opacity: e, flexShrink: 0, overflow: 'hidden' }}>{m.render}</div>;
          const isAgent = m.role === 'agent';
          const p = isAgent ? MOTION.pop(T, m.at, 0.5) : e;
          const n = m.typed ? Math.floor(m.text.length * c01((T - m.at - 0.2) / 0.9)) : m.text.length;
          // Dar sahnede uzun mesaj daha cok satira kiriliyor.
          const tavan = m.long ? 360 : dar ? 160 : 90;
          return (
            <div key={i} style={{ maxHeight: tavan * e, opacity: e, display: 'flex', justifyContent: isAgent ? 'flex-end' : 'flex-start', flexShrink: 0 }}>
              <div style={{ maxWidth: 780, fontFamily: SANS, fontSize: m.long ? 20 : 24, lineHeight: 1.3, padding: '2px 12px', background: isAgent ? C.bg : C.sand, border: `2px solid ${isAgent ? C.green : C.sandLine}`, color: C.ink, transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: isAgent ? 'right center' : 'left center' }}>
                {m.text.slice(0, n)}{m.typed && n < m.text.length && T > m.at ? <span style={{ opacity: 0.5 }}>▍</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function SlotBank({ T, c, vb }) {
  const { M, n } = useM();
  const { SLOTS, VOI, soru1, soru2, slotSutun } = useO();
  const esik = n(THRESHOLD, 2);
  const dar = useDar();
  const asked = { [soru1]: c.Ask1 + 0.2, [soru2]: c.Ask2 + 0.2 };
  const pick = { [soru1]: [c.Step0 + 4.6, c.Ask1 + 1.0], [soru2]: [c.Step1 + 3.8, c.Ask2 + 1.0] };
  const decided = T >= c.Step2 + 3.0;
  return (
    <Panel top={484 + kay(dar)} height={292}
           title={dar ? M.slotBaslikDar : M.slotBaslik} color={C.green}
           right={<Label color={C.green}>{dar ? M.slotSagDar(esik) : M.slotSag(esik)}</Label>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: C.ink }}>
        {SLOTS.map((s) => {
          const v = lerp(VOI[vb.a][s.slot], VOI[vb.b][s.slot], vb.e);
          const isAsked = asked[s.slot] != null && T >= asked[s.slot];
          const pk = pick[s.slot];
          const hl = pk ? c01(MOTION.pop(T, pk[0], 0.5) * (1 - MOTION.enter(T, pk[1], 0.4))) : 0;
          const skip = !isAsked && decided;
          const skipE = MOTION.enter(T, c.Step2 + 3.0 + SLOTS.indexOf(s) * 0.1, 0.4);
          const above = v > THRESHOLD;
          let status;
          if (isAsked) status = <Chip color={C.green} fill={C.green} text={C.bg}>{M.soruldu}</Chip>;
          else if (skip) status = <Chip color={C.muted} text={C.muted} style={{ opacity: skipE }}>{M.sorulmadi}</Chip>;
          else status = <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: above ? C.green : C.muted }}>{T < c.Step0 + 3 ? '—' : n(v, 3)}</div>;
          return (
            <div key={s.slot} style={{ position: 'relative', height: 48, background: hl > 0.5 ? C.greenLight : C.bg, display: 'grid', gridTemplateColumns: `${slotSutun}px minmax(0,1fr) 124px`, gap: 16, alignItems: 'center', padding: '0 20px' }}>
              <div style={{ position: 'absolute', inset: 0, border: `3px solid ${C.green}`, opacity: hl }}></div>
              <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: isAsked ? C.green : C.ink }}>{s.slot}</div>
              <div style={{ fontFamily: SANS, fontSize: 20, color: skip ? C.muted : C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: skip ? 1 - 0.4 * skipE : 1 }}>“{s.q}”</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{status}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function TopOptions({ T, c, pb, probs, top, correctAt }) {
  const { M, pct } = useM();
  const { OPTION_IDS, WINNER } = useO();
  const dar = useDar();
  const list = OPTION_IDS.map((id) => ({ id, p: lerp(probs[pb.a][id], probs[pb.b][id], pb.e) })).sort((x, y) => y.p - x.p).slice(0, 3);
  const decided = c01(MOTION.pop(T, c.Step2 + 3.0, 0.6));
  const correct = MOTION.enter(T, correctAt, 0.4);
  const ust = top + kay(dar);
  return (
    <Panel top={ust} height={1000 + kay(dar) - ust} title={M.secenekIlk3} color={C.cobalt} right={<Label color={C.muted}>{M.pBirim}</Label>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: C.ink }}>
        {list.map((o, i) => {
          const win = i === 0 && o.id === WINNER && decided > 0.01;
          return (
            <div key={i} style={{ position: 'relative', height: 48, background: win && correct > 0.5 ? C.greenLight : C.bg, display: 'grid', gridTemplateColumns: '256px minmax(0,1fr) 110px', gap: 16, alignItems: 'center', padding: '0 20px' }}>
              {win ? <div style={{ position: 'absolute', inset: 0, border: `3px solid ${C.cobalt}`, opacity: decided }}></div> : null}
              <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: win ? C.cobalt : C.ink }}>{o.id}{win && correct > 0.5 ? ' ✓' : ''}</div>
              <div style={{ position: 'relative', height: 16, border: B, background: C.bg, boxSizing: 'border-box' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c01(o.p) * 100}%`, background: C.cobalt }}></div>
              </div>
              <div style={{ textAlign: 'right', fontFamily: HEAD, fontSize: 28, fontWeight: 900, letterSpacing: -1, color: C.cobalt }}>{pct(o.p, 1)}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ResultCard({ T, at, children }) {
  const e = MOTION.pop(T, at, 0.6);
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: 140, border: B, background: C.bg, padding: '22px 26px', boxSizing: 'border-box', zIndex: 5, opacity: c01(e * 1.4), transform: `translateY(${(1 - c01(e)) * 30}px) scale(${0.94 + 0.06 * e})`, boxShadow: `7px 7px 0 ${C.ink}` }}>
      <SlashDeco />
      {children}
    </div>
  );
}

function LavoirSide({ T, c }) {
  const { M } = useM();
  const { TEXT, LAVOIR_PROBS, bizAd, kazanan, sorusuz, slotlar } = useO();
  const pb = blend(T, [c.Step0 + 1.4, c.Step1 + 0.4, c.Step2 + 0.4], 1.4);
  const vb = blend(T, [c.Step0 + 3.0, c.Step1 + 2.2, c.Step2 + 1.6], 1.0);
  const msgs = [
    { role: 'user', text: TEXT.m0, at: c.Step0 + 0.3 },
    { role: 'agent', text: TEXT.q1, at: c.Ask1 + 0.2 },
    { role: 'user', text: TEXT.a1, at: c.Ask1 + 1.3, typed: true },
    { role: 'agent', text: TEXT.q2, at: c.Ask2 + 0.2 },
    { role: 'user', text: TEXT.a2, at: c.Ask2 + 1.3, typed: true },
  ];
  return (
    <>
      <SideTitle T={T} name={bizAd} sub={M.bizimAlt} badge={<Chip color={C.green} fill={C.green} text={C.bg}>{M.llmYok}</Chip>} />
      <Chat T={T} msgs={msgs} height={400} />
      <SlotBank T={T} c={c} vb={vb} />
      <TopOptions T={T} c={c} pb={pb} probs={LAVOIR_PROBS} top={796} correctAt={c.Result + 0.3} />
      <ResultCard T={T} at={c.Result + 1.0}>
        <Label color={C.muted}>{M.sonuc}</Label>
        <div style={{ fontFamily: HEAD, fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginTop: 6 }}>{M.yonOn}<span style={{ color: C.green }}>{kazanan} ✓</span></div>
        <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted, marginTop: 8 }}>{M.lavoirSonucAlt({ soru: 2, atlanan: slotlar.length - 2, sorusuz })}</div>
      </ResultCard>
    </>
  );
}

function LayaSide({ T, c, reorder }) {
  const { M, n, pct } = useM();
  const { TEXT, LAYA_CONF, OPTION_IDS, LAYA_PROBS, LAYA_RANK, LAYA_GUESS, layaAd } = useO();
  const dar = useDar();
  const pb = blend(T, [c.Step0 + 1.4], 1.4);
  const gb = blend(T, [c.Step0 + 3.0], 1.0);
  const conf = lerp([0, LAYA_CONF][gb.a], [0, LAYA_CONF][gb.b], gb.e);
  const handoffAt = c.Ask1 + 0.3;
  const waited = Math.max(0, Math.floor(T - handoffAt));
  const idle = MOTION.enter(T, handoffAt + 0.6, 0.8);
  const guess = MOTION.enter(T, c.Step0 + 4.6, 0.4);
  const msgs = [
    { role: 'user', text: TEXT.m0, at: c.Step0 + 0.3 },
    { at: handoffAt, render: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
        <div style={{ flex: 1, height: 2, background: C.ink }}></div>
        <Chip fill={C.ink} text={C.bg}>{M.devredildi}</Chip>
        <div style={{ flex: 1, height: 2, background: C.ink }}></div>
      </div>) },
    { at: handoffAt + 0.5, render: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, border: `2px dashed ${C.ink}`, padding: '6px 12px' }}>
        <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted }}>{M.bekleniyor}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap' }}>{M.kuyruk} 0:{String(waited).padStart(2, '0')}</div>
      </div>) },
  ];
  const ROW = 50, STEP = 52;
  return (
    <>
      <SideTitle T={T} name={layaAd} sub={layaAd.length > 8 ? null : M.layaAlt} badge={<Chip>{M.kararVeyaDevret}</Chip>} />
      <Chat T={T} msgs={msgs} height={400} />
      <div style={{ opacity: 1 - 0.45 * idle }}>
        <Panel top={484 + kay(dar)} height={516} title={M.secenekler} color={C.cobalt} right={<Label color={C.muted}>{M.pBirim}</Label>}>
          <div style={{ position: 'relative', background: C.ink, height: STEP * 5 }}>
            {OPTION_IDS.map((id, i) => {
              const p = lerp(LAYA_PROBS[pb.a][id], LAYA_PROBS[pb.b][id], pb.e);
              const pos = reorder ? lerp(LAYA_RANK[pb.a].indexOf(id), LAYA_RANK[pb.b].indexOf(id), pb.e) : i;
              const isGuess = id === LAYA_GUESS;
              return (
                <div key={id} style={{ position: 'absolute', left: 0, right: 0, top: pos * STEP, height: ROW, background: C.bg, display: 'grid', gridTemplateColumns: '256px minmax(0,1fr) 110px', gap: 16, alignItems: 'center', padding: '0 20px', boxSizing: 'border-box' }}>
                  {isGuess ? <div style={{ position: 'absolute', inset: 0, border: `3px solid ${C.ink}`, opacity: guess }}></div> : null}
                  <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600 }}>{id}</div>
                  <div style={{ position: 'relative', height: 16, border: B, background: C.bg, boxSizing: 'border-box' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c01(p) * 100}%`, background: C.cobalt }}></div>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: HEAD, fontSize: 28, fontWeight: 900, letterSpacing: -1, color: C.cobalt }}>{pct(p, 1)}</div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16, borderTop: B }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Label color={C.muted}>{M.guven}</Label>
              <div style={{ position: 'relative', flex: 1, height: 16, border: B, boxSizing: 'border-box' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c01(conf) * 100}%`, background: C.ink }}></div>
                <div style={{ position: 'absolute', left: '85%', top: -8, bottom: -8, width: 3, background: C.red }}></div>
              </div>
              <div style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 900, letterSpacing: -1, minWidth: 80, textAlign: 'right' }}>{T < c.Step0 + 3 ? '—' : n(conf, 2)}</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.muted, opacity: guess }}>{M.layaKural(n(LAYA_CONF, 2), n(0.85, 2), LAYA_GUESS)}</div>
          </div>
        </Panel>
      </div>
      <ResultCard T={T} at={c.Result + 0.4}>
        <Label color={C.muted}>{M.sonuc}</Label>
        <div style={{ fontFamily: HEAD, fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginTop: 6 }}>{M.layaSonuc}</div>
        <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted, marginTop: 8 }}>{M.layaSonucAlt(n(LAYA_CONF, 2), n(0.85, 2), pct(LAYA_PROBS[1][LAYA_GUESS], 0), LAYA_GUESS)}<span style={{ color: C.red }}>✗</span></div>
      </ResultCard>
    </>
  );
}

function FlowBox({ label, title, sub, color, e, fill, textCol }) {
  return (
    <div style={{ position: 'relative', flex: 1, border: `${color === C.green ? 4 : 2}px solid ${color}`, background: fill || C.bg, padding: '20px 24px', opacity: c01(e * 1.5), transform: `translateY(${(1 - c01(e)) * 24}px)` }}>
      <SlashDeco color={color} />
      <Label color={textCol || color}>{label}</Label>
      <div style={{ fontFamily: HEAD, fontSize: 40, fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.05, marginTop: 8 }}>{title}</div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted, marginTop: 8, lineHeight: 1.35 }}>{sub}</div>
    </div>
  );
}
function BigArrow({ e }) {
  const dar = useDar();
  if (dar) {
    // Dar sahnede akis dikey: ok asagi bakiyor.
    return (
      <div style={{ height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: e }}>
        <div style={{ width: 4, height: 30 * e, background: C.ink }}></div>
        <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: `14px solid ${C.ink}` }}></div>
      </div>
    );
  }
  return (
    <div style={{ width: 60, display: 'flex', alignItems: 'center', opacity: e }}>
      <div style={{ width: 40 * e, height: 4, background: C.ink }}></div>
      <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `14px solid ${C.ink}` }}></div>
    </div>
  );
}
function Point({ n, title, text, e, color = C.green, labelColor = C.green }) {
  return (
    <div style={{ flex: 1, borderTop: `4px solid ${color}`, paddingTop: 16, opacity: c01(e * 1.5), transform: `translateY(${(1 - c01(e)) * 20}px)` }}>
      <Label color={labelColor}>{n}</Label>
      <div style={{ fontFamily: HEAD, fontSize: 34, fontWeight: 800, letterSpacing: -1, marginTop: 6 }}>{title}</div>
      <div style={{ fontFamily: SANS, fontSize: 24, color: C.muted, marginTop: 6, lineHeight: 1.35 }}>{text}</div>
    </div>
  );
}

function Scope({ T, c }) {
  const { M } = useM();
  const { bizAd } = useO();
  const [f1, f2, f3] = M.akis;
  const [n1, n2, n3] = M.maddeler;
  const dar = useDar();
  const s = c.Scope;
  const inE = MOTION.enter(T, s, 0.6);
  // Outro yok: dongu sonunda sahne solar ve bos Intro karesine baglanir.
  const out = 1 - MOTION.enter(T, TOPLAM - 0.7, 0.6);
  const title = MOTION.enter(T, s + 0.3, 0.6);
  const b1 = MOTION.pop(T, s + 1.0, 0.6), a1 = MOTION.enter(T, s + 1.5, 0.4);
  const b2 = MOTION.pop(T, s + 1.8, 0.6), a2 = MOTION.enter(T, s + 2.4, 0.4);
  const b3 = MOTION.pop(T, s + 2.7, 0.6);
  const p1 = MOTION.enter(T, s + 4.0, 0.5), p2 = MOTION.enter(T, s + 4.6, 0.5), p3 = MOTION.enter(T, s + 5.2, 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, opacity: inE * out, padding: dar ? '80px 32px' : '96px 100px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: dar ? 'center' : 'flex-start', gap: 48 }}>
      <div style={{ opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}>
        <Label color={C.green}>{M.fark}</Label>
        <div style={{ fontFamily: HEAD, fontSize: dar ? 52 : 76, fontWeight: 900, letterSpacing: dar ? -2 : -3, lineHeight: 1.02, marginTop: 12, textWrap: 'balance' }}>{M.farkBaslik(bizAd)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: dar ? 'column' : 'row', alignItems: 'stretch' }}>
        <FlowBox e={b1} color={C.sandLine} fill={C.sand} textCol={C.sandLine} label={f1.label} title={f1.title} sub={f1.sub} />
        <BigArrow e={a1} />
        <FlowBox e={b2} color={C.green} label={`${bizAd} · ${f2.label}`} title={f2.title} sub={f2.sub} />
        <BigArrow e={a2} />
        <FlowBox e={b3} color={C.ink} label={f3.label} title={f3.title} sub={f3.sub} textCol={C.muted} />
      </div>
      <div style={{ display: 'flex', flexDirection: dar ? 'column' : 'row', gap: 40 }}>
        <Point e={p1} n={n1.n} title={n1.title} text={n1.text} />
        <Point e={p2} n={n2.n} title={n2.title} text={n2.text} />
        <Point e={p3} n={n3.n} title={n3.title} text={n3.text} color={C.ink} labelColor={C.muted} />
      </div>
    </div>
  );
}

function Piece({ T, dar }) {
  const c = CUES;
  const lE = MOTION.enter(T, 0.4, 0.7);
  const rE = MOTION.enter(T, 0.6, 0.7);
  const fadeOut = 1 - MOTION.enter(T, c.Scope - 0.1, 0.5);
  // Genis sahnede iki model yan yana, dar sahnede ust uste (once LAVOIR).
  const yan = 1000 + kay(dar);
  const L = dar ? { left: 20, width: 600, top: 180 } : { left: 60, width: 860, top: 40 };
  const R = dar ? { left: 20, width: 600, top: 180 + yan + 60 } : { left: 1000, width: 860, top: 40 };
  const ayrac = dar
    ? { left: 20, top: 180 + yan + 29, width: 600, height: 2, transform: `scaleX(${lE})`, transformOrigin: 'left' }
    : { left: 959, top: 40, bottom: 40, width: 2, transform: `scaleY(${lE})`, transformOrigin: 'top' };
  return (
    <DarCtx.Provider value={dar}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg, color: C.ink, fontFamily: SANS, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: fadeOut }}>
          {/* Genis sahnede baslik yok (tasarim araci surumu); dar sahnede iki
              model ust uste durdugu icin neyin karsilastirildigi basta yaziyor. */}
          {dar ? <Header T={T} c={c} /> : null}
          <div style={{ position: 'absolute', background: C.ink, ...ayrac }}></div>
          <div style={{ position: 'absolute', ...L, height: yan, opacity: lE, transform: `translateX(${(1 - lE) * -40}px)` }}>
            <LavoirSide T={T} c={c} />
          </div>
          <div style={{ position: 'absolute', ...R, height: yan, opacity: rE, transform: `translateX(${(1 - rE) * 40}px)` }}>
            <LayaSide T={T} c={c} reorder={REORDER} />
          </div>
        </div>
        <Scope T={T} c={c} />
      </div>
    </DarCtx.Provider>
  );
}

export default function KarsilastirmaAkis() {
  const { t, model } = useDil();
  const o = t.sorun.ornek;
  const D = React.useMemo(() => hazirla(KARSILASTIRMA[model]), [model]);
  return (
    <OrnekCtx.Provider value={D}>
      <Oynatici key={model} sahneler={SAHNELER} cues={CUES} toplam={TOPLAM} genis={GENIS} dar={DAR}
                durgunKare={DURGUN_KARE} sahneAd={o.sahne} etiket={t.sorun.kart.etiket}>
        {(T, dar) => <Piece T={T} dar={dar} />}
      </Oynatici>
    </OrnekCtx.Provider>
  );
}
