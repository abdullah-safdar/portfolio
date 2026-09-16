import Link from "next/link";

/**
 * Sticky header for /writing and /writing/[slug] — a compact variant of
 * the home page's SiteHeader, matching the Claude Design writing-page
 * export. Nav links point back to the home page's own anchors.
 */
export function WritingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-bg/[.82] backdrop-blur-[14px]">
      <div className="flex items-center justify-between gap-4 px-[clamp(18px,4vw,60px)] py-[13px]">
        <Link
          href="/"
          className="inline-flex items-center gap-[9px] rounded-[3px] border border-fg/[.12] bg-fg/[.03] px-[11px] py-[7px] text-[12px] font-bold tracking-[-.01em]"
        >
          <span className="size-1.5 rounded-full bg-hi shadow-[0_0_9px_oklch(.82_.17_300)]" />
          ab<span className="blink text-hi">_</span>
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-[.06em]">
          <Link href="/#work" className="rounded-[3px] px-2.5 py-2 text-fg/[.66] transition-colors hover:text-fg">
            work
          </Link>
          <Link href="/#stack" className="rounded-[3px] px-2.5 py-2 text-fg/[.66] transition-colors hover:text-fg">
            stack
          </Link>
          <Link
            href="/writing"
            className="rounded-[3px] border border-accent-soft/[.34] bg-accent-soft/10 px-2.5 py-2 text-hi"
          >
            writing
          </Link>
          <Link
            href="/#contact"
            className="ml-1.5 rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-4 py-2.5 text-[11.5px] font-semibold text-[#130b24] shadow-[0_8px_24px_rgba(167,139,250,.3)]"
          >
            Hire me
          </Link>
        </div>
      </div>
    </header>
  );
}
