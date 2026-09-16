import Link from "next/link";

/**
 * Next's built-in not-found boundary, restyled to match the Claude
 * Design redesign (see the home page redesign plan). No shared header
 * here — a 404 has no section to highlight in the site nav — just the
 * wordmark linking home.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen min-w-0 flex-col items-center justify-center gap-5 bg-bg px-6 text-center text-fg">
      <Link
        href="/"
        className="inline-flex items-center gap-[9px] rounded-[3px] border border-fg/[.12] bg-fg/[.03] px-[11px] py-[7px] text-[12px] font-bold tracking-[-.01em] no-underline"
      >
        <span className="size-1.5 rounded-full bg-hi shadow-[0_0_9px_oklch(.82_.17_300)]" />
        ab<span className="blink text-hi">_</span>
      </Link>
      <p className="m-0 text-mid">bash: no such section — page not found.</p>
      <Link
        href="/"
        className="mt-1 rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-5 py-3 text-[13px] font-semibold text-[#130b24] no-underline"
      >
        back home
      </Link>
    </div>
  );
}
