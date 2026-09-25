import React from 'react';
import { DilProvider, useDil } from './i18n';
import Ust from './components/Ust';
import Giris from './components/Giris';
import MoganBert from './components/MoganBert';
import Laya from './components/Laya';
import Voi from './components/Voi';
import Veri from './components/Veri';
import Sonuc from './components/Sonuc';
import SonucTr from './components/SonucTr';
import Kaynak from './components/Kaynak';
import Alt from './components/Alt';

// Iki model tek sayfada: header ve model kartlari sabit, altindaki bolumler
// secili modele gore degisiyor (?model=tr). Bolumler menu capalariyla gezilir.
function Sayfa() {
  const { model } = useDil();
  const tr = model === 'tr';
  return (
    <div className="bg-paper-base text-ink-black font-sans antialiased relative min-h-screen flex flex-col">
      <Ust />
      <main className="max-w-[1100px] mx-auto px-6 py-10 md:py-14 flex flex-col gap-20 w-full min-w-0 flex-1">
        <Giris />
        {tr && <MoganBert />}
        <Laya />
        <Voi />
        <Veri />
        {tr ? <SonucTr /> : <Sonuc />}
        <Kaynak />
      </main>
      <Alt />
    </div>
  );
}

export default function App() {
  return (
    <DilProvider>
      <Sayfa />
    </DilProvider>
  );
}
