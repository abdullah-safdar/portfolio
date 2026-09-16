import Link from "next/link";

/** Compact footer shared by /writing and /writing/[slug]. */
export function WritingFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-[26px] gap-y-3.5 border-t border-edge bg-[linear-gradient(180deg,#0d0d0e,#101012)] px-[clamp(18px,4vw,60px)] py-[clamp(28px,3.4vw,42px)] text-[10px] tracking-[.14em] text-fg/[.52] uppercase">
      <span>© 2026 Abdullah Baig · writing</span>
      <div className="flex flex-wrap gap-[18px]">
        <Link href="/" className="text-fg/[.62]">
          portfolio
        </Link>
        <a href="https://github.com/abdullah-safdar" className="text-fg/[.62]">
          github ↗
        </a>
        <a href="#top" className="text-fg/[.62]">
          back to top ↑
        </a>
      </div>
    </footer>
  );
}
