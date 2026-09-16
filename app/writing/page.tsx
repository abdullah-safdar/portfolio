import type { Metadata } from "next";
import { getAllPosts, formatPostDate, readingTime } from "@/lib/posts";
import { WritingList, type WritingCard } from "./writing-list";

export const metadata: Metadata = {
  title: "Writing — Abdullah Baig",
  description:
    "Notes on architecture, AI-assisted delivery and web3 — dedup keys, zero-downtime migrations, and what actually pays off with AI in the loop.",
};

/**
 * /writing index — Claude Design redesign. Real posts via getAllPosts(),
 * mapped into the view-model WritingList's topic filter needs. WritingList
 * owns the hero text too, not just the filter/list — see its own comment
 * for why (the filter buttons must share a DOM subtree, and a section,
 * with the hero so the layout and the border-bottom land correctly).
 */
export default function WritingIndexPage() {
  const posts = getAllPosts();

  const cards: WritingCard[] = posts.map((post, i) => ({
    slug: post.slug,
    num: String(i + 1).padStart(2, "0"),
    topic: post.frontmatter.topic,
    dateLabel: formatPostDate(post.frontmatter.date),
    readLabel: readingTime(post.content),
    title: post.frontmatter.title,
    dek: post.frontmatter.summary,
  }));

  return (
    <div id="top">
      {posts.length === 0 ? (
        <section className="border-b border-edge px-[clamp(18px,4vw,60px)] py-[clamp(52px,7vw,104px)]">
          <div className="mx-auto max-w-[1180px]">
            <h1 className="m-0 mb-4 text-[length:clamp(30px,5.4vw,64px)] leading-[1.05] font-bold tracking-[-.05em] text-[#f6f5f3]">
              Notes from production.
            </h1>
            <p className="m-0 text-mid">Nothing published yet — check back soon.</p>
          </div>
        </section>
      ) : (
        <WritingList posts={cards} />
      )}

      <section className="relative overflow-hidden px-[clamp(18px,4vw,60px)] py-[clamp(54px,7vw,96px)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(56% 62% at 50% 50%,rgba(139,118,224,.14),transparent 72%)" }}
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-[9px] rounded-full border border-accent-soft/[.42] bg-accent-soft/10 px-3 py-[7px] text-[10px] font-medium tracking-[.16em] text-hi uppercase">
            <span
              className="size-1.5 rounded-full bg-hi shadow-[0_0_10px_oklch(.82_.17_300)]"
              style={{ animation: "pulseDot 1.9s ease-in-out infinite" }}
            />
            roughly monthly
          </span>
          <h2 className="m-0 text-[length:clamp(22px,3.2vw,36px)] leading-[1.14] font-bold tracking-[-.04em] text-[#f6f5f3]">
            New post when I have something worth the read.
          </h2>
          <p className="m-0 max-w-[48ch] text-[13px] leading-[1.7] text-mid">
            No newsletter funnel. Follow along on GitHub or drop me a line and I&apos;ll send the next one over.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:abdullahsafdar222@gmail.com"
              className="inline-flex items-center gap-2.5 rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-5 py-[13px] text-[13px] font-semibold text-[#130b24] shadow-[0_12px_34px_rgba(167,139,250,.3)] transition-transform duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-0.5"
            >
              get in touch <span className="opacity-70">→</span>
            </a>
            <a
              href="https://github.com/abdullah-safdar"
              className="inline-flex items-center gap-2.5 rounded-[3px] border border-fg/[.16] bg-[linear-gradient(180deg,rgba(242,240,238,.06),rgba(242,240,238,.02))] px-5 py-[13px] text-[13px] font-semibold transition-colors duration-200 hover:border-accent/55"
            >
              github <span className="opacity-50">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
