import React from 'react';
import { useDil, LAYA_GITHUB } from '../i18n';

export default function Alt() {
  const { t } = useDil();
  const bag = 'font-mono text-xs text-surface-variant hover:text-seafoam-bright transition-colors hover:underline decoration-2 underline-offset-4 uppercase no-underline';

  return (
    <footer className="bg-ink-black text-surface border-t-2 border-ink-black mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-12 px-6 w-full max-w-[1100px] mx-auto">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Mogan Logo" className="h-6 w-6 object-contain" />
          <span className="text-xl font-display font-bold text-surface uppercase">MOGANAI</span>
        </div>

        <p className="text-sm font-sans text-surface-variant m-0">{t.footer.lisans}</p>

        <nav className="flex gap-6">
          <a className={bag} href="https://moganai.github.io" target="_blank" rel="noopener noreferrer">MOGANBERT</a>
          <a className={bag} href="https://huggingface.co/moganai" target="_blank" rel="noopener noreferrer">HUGGINGFACE</a>
          <a className={bag} href={LAYA_GITHUB} target="_blank" rel="noopener noreferrer">LAYA</a>
        </nav>
      </div>
    </footer>
  );
}
