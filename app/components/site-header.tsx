import Link from "next/link";

const navLink =
  "inline-flex items-baseline gap-1.5 rounded-[3px] border border-transparent px-2.5 py-[7px] text-[10.5px] font-normal tracking-[.16em] text-dim uppercase transition-[color,border-color,background] duration-[180ms] hover:text-fg hover:border-accent/55 hover:bg-accent/10";

/**
 * Sticky site header for the redesigned home page: logo, section nav
 * (anchors within "/"), and a "hire me" CTA. Replaces Chrome on "/" only
 * — /writing and not-found keep the older Chrome for now (out of scope
 * for this pass, see the implementation plan).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex min-h-[58px] flex-wrap items-center justify-between gap-x-5 gap-y-2.5 border-b border-edge bg-[linear-gradient(180deg,rgba(8,8,10,.94),rgba(8,8,10,.78))] px-[clamp(18px,4vw,44px)] py-2 shadow-[0_1px_0_rgba(167,139,250,.12),0_14px_30px_-26px_#000] backdrop-blur-[14px] backdrop-saturate-[140%]">
      <Link
        href="#top"
        className="inline-flex items-center gap-[11px] rounded-[3px] border border-edge bg-fg/[.03] py-[7px] pr-2.5 pl-2 transition-[border-color,background] duration-[180ms] hover:border-accent/60 hover:bg-accent/10"
      >
        <span className="size-[11px] flex-none bg-accent shadow-[0_0_10px_rgba(167,139,250,.8)]" />
        <span className="text-[11.5px] font-bold tracking-[.22em] uppercase">abdullah baig</span>
        <span className="text-[10px] tracking-[.14em] text-dim">~/portfolio</span>
      </Link>
      <div className="flex items-center gap-[clamp(4px,1vw,10px)]">
        <nav className="flex flex-wrap items-center gap-0.5 text-[10.5px] tracking-[.16em] uppercase" aria-label="Primary">
          <Link href="#work" className={navLink}>
            <span className="text-hi">01</span>work
          </Link>
          <Link href="#stack" className={navLink}>
            <span className="text-hi">02</span>stack
          </Link>
          <Link href="#experience" className={navLink}>
            <span className="text-hi">03</span>experience
          </Link>
          <Link href="#writing" className={navLink}>
            <span className="text-hi">04</span>writing
          </Link>
        </nav>
        <Link
          href="#contact"
          className="ml-2 inline-flex items-center gap-2 rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-[18px] py-[11px] text-[11.5px] font-bold tracking-[.18em] text-[#130b24] uppercase shadow-[inset_0_1px_0_oklch(.93_.07_300),0_10px_24px_-12px_rgba(167,139,250,.6),0_0_0_1px_oklch(.66_.15_300)] transition-transform duration-[180ms] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-0.5"
        >
          <span className="size-[7px] rounded-full bg-[#130b24] shadow-[0_0_0_3px_rgba(19,11,36,.18)]" />
          hire me
        </Link>
      </div>
    </header>
  );
}
