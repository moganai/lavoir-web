import React from 'react';
import { DilProvider } from './i18n';
import Ust from './components/Ust';
import Giris from './components/Giris';
import Laya from './components/Laya';
import Voi from './components/Voi';
import Veri from './components/Veri';
import Sonuc from './components/Sonuc';
import Kaynak from './components/Kaynak';
import Alt from './components/Alt';

// Tek sayfa, alt rota yok: bolumler sirayla ve menu capalarla gezilir.
export default function App() {
  return (
    <DilProvider>
      <div className="bg-paper-base text-ink-black font-sans antialiased relative min-h-screen flex flex-col">
        <Ust />
        <main className="max-w-[1100px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-20 w-full min-w-0 flex-1">
          <Giris />
          <Laya />
          <Voi />
          <Veri />
          <Sonuc />
          <Kaynak />
        </main>
        <Alt />
      </div>
    </DilProvider>
  );
}
