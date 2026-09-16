"use client";

import { useEffect, useState } from "react";

/** Thin fixed progress bar tracking scroll position down the article. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-0.5 bg-fg/[.06]">
      <div
        className="h-full bg-[linear-gradient(90deg,oklch(.79_.14_300),oklch(.68_.15_300))] shadow-[0_0_12px_rgba(167,139,250,.7)]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
