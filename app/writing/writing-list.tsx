"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type WritingCard = {
  slug: string;
  num: string;
  topic: string;
  dateLabel: string;
  readLabel: string;
  title: string;
  dek: string;
};

/**
 * Hero text + topic filter + post list for /writing, as one client
 * component. The filter buttons and the list below them share filter
 * state, and the filter buttons sit inside the same hero section as the
 * kicker/title/intro (same padded column, no divider above them, per the
 * design) — splitting the hero's static text into a separate server
 * component would put the filter buttons in a different DOM subtree,
 * outside the hero section's own border and padding.
 */
export function WritingList({ posts }: { posts: WritingCard[] }) {
  const [topic, setTopic] = useState("All");

  const topics = useMemo(() => {
    const names = Array.from(new Set(posts.map((p) => p.topic)));
    return [
      { name: "All", count: posts.length },
      ...names.map((name) => ({
        name,
        count: posts.filter((p) => p.topic === name).length,
      })),
    ];
  }, [posts]);

  const visible = topic === "All" ? posts : posts.filter((p) => p.topic === topic);

  return (
    <>
      <section className="relative overflow-hidden border-b border-edge px-[clamp(18px,4vw,60px)] py-[clamp(52px,7vw,104px)] pb-[clamp(34px,4vw,56px)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(58% 70% at 18% 20%,rgba(139,118,224,.14),transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-[1180px] flex-col gap-[18px]">
          <span className="text-[10.5px] font-medium tracking-[.24em] text-hi uppercase">
            ~/abdullah/writing $ ls -la
          </span>
          <h1 className="m-0 text-[length:clamp(30px,5.4vw,64px)] leading-[1.05] font-bold tracking-[-.05em] text-[#f6f5f3]">
            Notes from production.
          </h1>
          <p className="m-0 max-w-[60ch] text-[length:clamp(13.5px,1.1vw,15.5px)] leading-[1.7] text-mid">
            Architecture decisions I had to live with — event-driven systems, migrations that couldn&apos;t go
            down, and where AI actually earns its place on a team of six.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {topics.map((t) => {
              const active = t.name === topic;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTopic(t.name)}
                  className={`cursor-pointer rounded-full border px-3.5 py-2 text-[10.5px] font-medium tracking-[.14em] uppercase transition-colors ${
                    active
                      ? "border-accent-soft/55 bg-accent-soft/[.12] text-hi"
                      : "border-fg/[.13] text-fg/[.62] hover:border-fg/25"
                  }`}
                >
                  {t.name.toLowerCase()}
                  <span className="ml-[7px] opacity-50">{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-edge px-[clamp(18px,4vw,60px)] py-[clamp(30px,4vw,54px)]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[clamp(18px,2.4vw,30px)]">
          <span className="text-[10px] font-medium tracking-[.24em] text-fg/60 uppercase">
            {topic === "All"
              ? `${posts.length} posts`
              : `${visible.length} ${visible.length === 1 ? "post" : "posts"} in ${topic.toLowerCase()}`}
          </span>
          {visible.map((p) => (
            <Link
              key={p.slug}
              href={`/writing/${p.slug}`}
              className="grid grid-cols-1 items-center gap-[clamp(18px,2.6vw,34px)] rounded border border-edge bg-[linear-gradient(180deg,rgba(255,255,255,.022),transparent)] p-[clamp(18px,2.2vw,26px)] transition-[border-color,transform] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-[3px] hover:border-accent/50 sm:grid-cols-[minmax(0,220px)_1fr]"
            >
              <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-sm border border-edge bg-[linear-gradient(140deg,rgba(167,139,250,.13),rgba(255,255,255,.015)_58%,transparent)] p-4.5">
                <span className="text-[9.5px] font-medium tracking-[.16em] text-hi uppercase">{p.topic}</span>
                <span className="text-[length:clamp(48px,7vw,86px)] leading-none font-bold tracking-[-.06em] text-fg/[.16]">
                  {p.num}
                </span>
                <span className="text-[10px] tracking-[.18em] text-fg/40 uppercase">text only</span>
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <span className="flex items-center gap-2.5 text-[10px] font-medium tracking-[.18em] text-fg/[.58] uppercase">
                  {p.num}
                  <span className="h-px w-3.5 bg-accent" />
                  {p.dateLabel} · {p.readLabel}
                </span>
                <span className="text-[length:clamp(19px,2.3vw,29px)] leading-[1.18] font-bold tracking-[-.04em] text-[#f6f5f3]">
                  {p.title}
                </span>
                <span className="text-[13px] leading-[1.7] text-mid">{p.dek}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
