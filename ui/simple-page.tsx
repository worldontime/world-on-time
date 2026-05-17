import { Clock3 } from "lucide-react";
import type { ReactNode } from "react";

export function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="World On Time home">
          <span>
            <Clock3 size={19} />
          </span>
          World On Time
        </a>
        <nav aria-label="Primary navigation">
          <a href="/#world-clock">World Clock</a>
          <a href="/#converter">Converter</a>
          <a href="/#timers">Timers</a>
          <a href="/faq">FAQ</a>
        </nav>
      </header>
      <article className="simple-page">
        <p className="eyebrow">World On Time</p>
        <h1>{title}</h1>
        {children}
      </article>
    </main>
  );
}
