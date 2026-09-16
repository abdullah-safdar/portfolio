import Link from "next/link";
import { SiteHeader } from "./components/site-header";
import { PageEffects } from "./components/page-effects";
import { HeroCoder } from "./components/three/hero-coder";
import { CapOrb } from "./components/three/cap-orb";
import { getAllPosts, formatPostDate } from "@/lib/posts";
import { home } from "@/lib/home";

/**
 * Home page — the Claude Design redesign (see the implementation plan:
 * "Implement the Claude Design home page redesign"). Structure and copy
 * are ported from the design's exported template; content lives in
 * content/home.json (edited via the Tina `home` singleton at /admin)
 * except the writing section, which reads real posts via lib/posts.ts.
 */

const sectionLabel =
  "text-[13px] font-bold tracking-[.24em] uppercase text-fg";

export default function Home() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="min-w-0 bg-bg text-fg [&_a]:no-underline">
      <PageEffects />
      <SiteHeader />

      {/* ── hero ──────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="grid grid-cols-1 items-center gap-[clamp(24px,4vw,48px)] border-b border-edge bg-panel px-[clamp(18px,4vw,60px)] py-[clamp(48px,7vw,104px)] lg:grid-cols-2"
      >
        <div className="flex min-w-0 flex-col gap-6">
          <div
            data-type="1"
            style={{ animation: "fadeUp .6s .05s both" }}
            className="text-[11.5px] font-medium tracking-[.14em] text-hi"
          >
            {home.hero.kicker}
          </div>
          <h1
            data-type="2"
            style={{ animation: "fadeUp .75s .18s both" }}
            className="m-0 text-[length:clamp(30px,4.4vw,56px)] leading-[1.08] font-bold tracking-[-.035em] text-[#f6f5f3]"
          >
            Systems that
            <br />
            hold up at
            <br />
            3&nbsp;a.m.
            <span aria-hidden="true" className="blink ml-[.18em] h-[.9em] w-[.55em] align-[-.08em] bg-accent" />
          </h1>
          <p
            data-type="3"
            data-type-speed="7"
            style={{ animation: "fadeUp .75s .34s both" }}
            className="m-0 max-w-[52ch] text-[length:clamp(14.5px,1.2vw,16.5px)] leading-[1.65] text-mid"
          >
            {home.hero.intro}
          </p>
          <div style={{ animation: "fadeUp .75s .5s both" }} className="mt-1 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-3 rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-[22px] py-[15px] text-[14px] font-semibold text-[#130b24] shadow-[inset_0_1px_0_oklch(.92_.07_300),0_10px_26px_-12px_rgba(167,139,250,.6),0_0_0_1px_oklch(.66_.15_300)] transition-transform duration-[180ms] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-0.5"
            >
              See the work<span className="text-[13px] opacity-75">→</span>
            </a>
            <a
              href="#contact"
              className="relative inline-flex items-center gap-[9px] rounded-[3px] border border-fg/[.16] bg-[linear-gradient(180deg,rgba(242,240,238,.06),rgba(242,240,238,.02))] px-[22px] py-[15px] text-[14px] font-medium transition-[border-color,background,transform,box-shadow] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-0.5 hover:border-accent hover:bg-[linear-gradient(180deg,rgba(167,139,250,.2),rgba(167,139,250,.06))]"
            >
              <span className="text-hi">$</span>Get in touch
              <span aria-hidden="true" className="blink h-[1em] w-[.5em] align-[-.12em] bg-hi" />
            </a>
          </div>
          <div style={{ animation: "fadeUp .75s .62s both" }} className="flex flex-wrap gap-[18px] pt-1.5 text-[11px] tracking-[.1em] text-dim">
            <a href={home.hero.github}>github.com/abdullah-safdar</a>
            <a href={home.hero.linkedin}>linkedin.com/in/abdullah-baig</a>
          </div>
        </div>
        <div
          data-reveal=""
          data-glow-in=""
          style={{
            animation: "glowIn 1.1s .25s both",
            aspectRatio: "1/1.08",
            maxHeight: 680,
            background: "radial-gradient(60% 34% at 50% 92%,rgba(167,139,250,.1),rgba(13,13,14,0) 70%)",
          }}
          className="relative min-w-0"
        >
          <HeroCoder />
        </div>
      </section>

      {/* ── ticker ────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-b border-edge bg-bg py-[13px]">
        <div style={{ animation: "ticker 42s linear infinite" }} className="flex w-max gap-10">
          {[...home.ticker, ...home.ticker].map((t, i) => (
            <span key={i} className="flex-none text-[10.5px] font-medium tracking-[.24em] text-dim uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── stats ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 border-b border-edge bg-bg sm:grid-cols-2 lg:grid-cols-4">
        {home.stats.map((s) => (
          <div
            key={s.idx}
            data-reveal=""
            className="relative flex flex-col gap-3.5 overflow-hidden border-l border-edge px-[clamp(18px,3vw,34px)] py-[clamp(26px,3vw,38px)] pb-[clamp(22px,2.6vw,30px)] transition-colors duration-200 hover:bg-accent/5"
          >
            <span className="absolute top-[-20px] right-[-4px] text-[86px] font-bold tracking-[-.06em] text-fg/[.075]">
              {s.idx}
            </span>
            <span className="flex items-center gap-2 text-[10.5px] font-medium tracking-[.22em] text-hi uppercase">
              <span className="h-px w-3.5 bg-accent" />
              {s.tag}
            </span>
            <span className="flex items-baseline gap-1 text-[length:clamp(30px,3.4vw,44px)] font-bold tracking-[-.04em] text-[#f6f5f3]">
              {s.n}
              <span className="text-[13px] font-medium tracking-[.08em] text-hi">{s.unit}</span>
            </span>
            <span className="text-[12.5px] leading-[1.6] text-mid">{s.label}</span>
            <span className="relative mt-auto block h-0.5 w-full bg-edge">
              <span
                className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,oklch(.72_.15_300),rgba(167,139,250,.25))]"
                style={{ width: s.bar }}
              />
            </span>
          </div>
        ))}
      </section>

      {/* ── selected work ─────────────────────────────────────────────── */}
      <section id="work" className="border-b border-edge bg-panel px-[clamp(18px,4vw,60px)] py-[clamp(48px,6vw,84px)]">
        <div className="mb-[30px] flex flex-wrap items-baseline justify-between gap-3">
          <h2 className={sectionLabel}>selected work</h2>
          <span className="text-[11px] tracking-[.14em] text-dim">shipped 2019 — 2026</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.projects.map((p) => (
            <a
              key={p.num}
              href="#work"
              data-reveal=""
              className="relative flex min-w-0 flex-col overflow-hidden rounded border border-edge bg-[linear-gradient(180deg,#18181c,#131317)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-[3px] hover:border-accent/60 hover:shadow-[0_18px_40px_-28px_rgba(167,139,250,1)]"
            >
              <span className="flex items-center justify-between gap-2.5 border-b border-edge bg-fg/[.02] px-3.5 py-[11px] text-[10.5px] tracking-[.08em] text-dim">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {p.path}
                </span>
                <span className="text-hi">{p.year}</span>
              </span>
              <span className="flex flex-col gap-3 px-[18px] py-5 pb-[18px]">
                <span className="flex items-baseline gap-2.5">
                  <span className="text-[26px] font-bold tracking-[-.05em] text-hi">{p.num}</span>
                  <span className="text-[19px] font-bold tracking-[-.03em] text-[#f6f5f3]">{p.name}</span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 rounded-[3px] border border-dashed border-fg/[.12] bg-fg/[.015] px-3 py-[11px] text-[10.5px] font-medium tracking-[.06em] text-dim">
                  {p.flow.map((node, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {node.a ? <span className="text-hi opacity-55">─▶</span> : null}
                      {node.n}
                    </span>
                  ))}
                </span>
                <span className="text-[12.5px] leading-[1.68] text-mid">{p.blurb}</span>
                <span className="flex items-start gap-2.5 border-l-2 border-accent bg-accent/[.08] px-3 py-2.5 text-[11.5px] font-medium leading-[1.55] text-[#efeaff]">
                  {p.metric}
                </span>
                <span className="mt-0.5 flex flex-wrap gap-1.5">
                  {p.tags.map((tg) => (
                    <span
                      key={tg}
                      className="rounded-sm border border-fg/[.14] px-2 py-1.5 text-[10px] font-medium tracking-[.12em] text-dim uppercase"
                    >
                      {tg}
                    </span>
                  ))}
                </span>
                <span className="mt-1.5 flex items-center justify-between border-t border-edge pt-3 text-[10.5px] font-medium tracking-[.16em] text-hi uppercase">
                  read case<span>→</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── capabilities + stack ──────────────────────────────────────── */}
      <section id="stack" className="border-b border-edge bg-[#101012] px-[clamp(18px,4vw,60px)] py-[clamp(44px,5vw,72px)]">
        <h2 className={`${sectionLabel} mb-[34px]`}>capabilities</h2>
        <div className="grid grid-cols-1 gap-[clamp(16px,2vw,26px)] sm:grid-cols-2 lg:grid-cols-3">
          {home.caps.map((c) => (
            <div
              key={c.idx}
              data-reveal=""
              className="flex min-w-0 flex-col gap-[18px] rounded border border-edge bg-[linear-gradient(180deg,rgba(255,255,255,.022),transparent)] px-5 py-[22px] pb-6 transition-transform duration-[220ms] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1 hover:border-accent/[.42]"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                <div
                  className="pointer-events-none absolute inset-x-[12%] top-[12%] bottom-[6%]"
                  style={{ background: "radial-gradient(58% 48% at 50% 72%,rgba(139,118,224,.20),transparent 70%)" }}
                />
                <CapOrb shape={c.shape} />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <span className="flex items-center gap-2 text-[10.5px] font-medium tracking-[.2em] text-hi uppercase">
                  {c.idx}
                  <span className="h-px w-3 bg-accent" />
                </span>
                <span className="text-[15.5px] font-bold tracking-[.02em]">{c.label}</span>
                <span className="text-[12px] leading-[1.65] text-mid">{c.note}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-11 grid grid-cols-1 gap-x-[38px] gap-y-[26px] sm:grid-cols-2 lg:grid-cols-4">
          {home.skillGroups.map((g) => (
            <div key={g.title} className="min-w-0">
              <div className="mb-[11px] text-[10px] font-medium tracking-[.18em] text-hi uppercase">{g.title}</div>
              <p className="m-0 text-[13px] leading-[1.7] text-mid">{g.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── experience ────────────────────────────────────────────────── */}
      <section id="experience" className="border-b border-edge bg-panel px-[clamp(18px,4vw,60px)] py-[clamp(48px,6vw,84px)]">
        <h2 className={`${sectionLabel} mb-[30px]`}>experience</h2>
        {home.roles.map((r) => (
          <div
            key={r.title + r.company}
            data-reveal=""
            className="grid grid-cols-1 gap-[clamp(16px,3vw,44px)] border-t border-edge py-7 lg:grid-cols-2"
          >
            <div className="min-w-0">
              <div className="text-[length:clamp(17px,1.8vw,22px)] leading-[1.28] font-semibold tracking-[-.02em] text-[#f6f5f3]">
                {r.title}
              </div>
              <div className="mt-[7px] text-[12px] tracking-[.1em] text-dim">{r.company}</div>
              <div className="mt-1 text-[11px] tracking-[.14em] text-hi">{r.years}</div>
            </div>
            <div className="flex min-w-0 flex-col gap-[11px]">
              {r.points.map((pt, i) => (
                <div key={i} className="grid grid-cols-[16px_minmax(0,1fr)] items-baseline gap-2.5">
                  <span className="text-[10px] leading-[1.7] text-dim">—</span>
                  <span className="text-[13.5px] leading-[1.68] text-mid/90">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── writing ───────────────────────────────────────────────────── */}
      <section id="writing" className="border-b border-edge bg-bg px-[clamp(18px,4vw,60px)] py-[clamp(48px,6vw,84px)]">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-fg/[.14] pb-3.5">
          <h2 className={sectionLabel}>writing</h2>
          <span className="text-[10.5px] tracking-[.2em] text-dim uppercase">
            notes on architecture, AI-assisted delivery &amp; web3
          </span>
        </div>
        {posts.length === 0 ? (
          <p className="m-0 py-6 text-mid">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              data-reveal=""
              className="grid grid-cols-1 items-baseline gap-3.5 gap-x-[clamp(16px,3vw,36px)] border-b border-fg/[.08] px-2 py-6 transition-colors hover:bg-[#131316] sm:grid-cols-2"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <span className="text-[length:clamp(16px,1.7vw,20px)] leading-[1.35] font-semibold tracking-[-.02em] text-[#f4f2ef]">
                  {post.frontmatter.title}
                </span>
                <span className="text-[10.5px] tracking-[.16em] text-hi uppercase">
                  {formatPostDate(post.frontmatter.date)}
                </span>
              </div>
              <p className="m-0 text-[13.5px] leading-[1.68] text-mid">{post.frontmatter.summary}</p>
            </Link>
          ))
        )}
        <div className="mt-[22px]">
          <Link href="/writing" className="border-b border-fg/30 pb-[5px] text-[14px] font-medium">
            All posts
          </Link>
        </div>
      </section>

      {/* ── contact ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative overflow-hidden border-t border-edge bg-bg px-[clamp(18px,4vw,60px)] py-[clamp(90px,13vw,190px)] pb-[clamp(70px,9vw,120px)]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(62% 68% at 50% 46%,rgba(139,118,224,.17),transparent 72%)" }}
        />
        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-end gap-[clamp(30px,5vw,64px)] lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[18px]">
            <span className="text-[10.5px] font-medium tracking-[.24em] text-hi uppercase">~/abdullah $ hire</span>
            <h2 className="m-0 text-[length:clamp(30px,5.6vw,68px)] leading-[1.06] font-bold tracking-[-.05em] text-[#f6f5f3]">
              Open to lead &amp; staff-level backend and full-stack work.
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-[13px] leading-[1.6] text-mid">
            <a href={`mailto:${home.contact.email}`} className="tracking-[.04em] text-hi">
              {home.contact.email}
            </a>
            <span>{home.contact.phone}</span>
            <span className="text-dim">{home.contact.location}</span>
          </div>
        </div>
      </section>

      {/* ── footer ────────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-edge bg-[linear-gradient(180deg,#0d0d0e,#101012)] px-[clamp(18px,4vw,60px)] pt-[clamp(34px,4.5vw,58px)]">
        <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-edge pb-[clamp(26px,3.4vw,40px)]">
          <div className="flex min-w-0 flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-[9px] rounded-full border border-accent-soft/[.42] bg-accent-soft/10 px-3 py-[7px] text-[10px] font-medium tracking-[.16em] text-hi uppercase">
              <span className="pulse-dot size-1.5 rounded-full bg-hi shadow-[0_0_10px_oklch(.82_.17_300)]" style={{ animation: "pulseDot 1.9s ease-in-out infinite" }} />
              available for new work
            </span>
            <div className="text-[length:clamp(30px,5.4vw,62px)] leading-none font-bold tracking-[-.05em] text-[#f6f5f3]">
              abdullah baig<span className="blink text-hi">_</span>
            </div>
          </div>
          <a
            href={`mailto:${home.contact.email}`}
            className="inline-flex items-center gap-[11px] rounded-[3px] bg-[linear-gradient(180deg,oklch(.79_.14_300),oklch(.68_.15_300))] px-5 py-[13px] text-[13px] font-semibold text-[#130b24] shadow-[0_12px_34px_rgba(167,139,250,.3)] transition-transform duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-0.5"
          >
            start a conversation <span className="opacity-70">→</span>
          </a>
        </div>

        <div className="relative grid grid-cols-1 gap-x-[34px] gap-y-[26px] py-[clamp(26px,3.4vw,38px)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-[13px] text-[10px] font-medium tracking-[.18em] text-hi uppercase">Education</div>
            <div className="text-[13px] leading-[1.6] whitespace-pre-line text-mid">{home.contact.education}</div>
          </div>
          <div>
            <div className="mb-[13px] text-[10px] font-medium tracking-[.18em] text-hi uppercase">Elsewhere</div>
            <div className="flex flex-col gap-0.5 text-[13px]">
              <a href={home.hero.github} className="flex items-center justify-between gap-2.5 border-b border-fg/[.06] py-1.5 transition-colors hover:text-hi">
                GitHub<span className="text-[11px] opacity-40">↗</span>
              </a>
              <a href={home.hero.linkedin} className="flex items-center justify-between gap-2.5 border-b border-fg/[.06] py-1.5 transition-colors hover:text-hi">
                LinkedIn<span className="text-[11px] opacity-40">↗</span>
              </a>
              <Link href="/writing" className="flex items-center justify-between gap-2.5 py-1.5 transition-colors hover:text-hi">
                Blog<span className="text-[11px] opacity-40">→</span>
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-[13px] text-[10px] font-medium tracking-[.18em] text-hi uppercase">Now</div>
            <div className="text-[13px] leading-[1.6] text-mid">{home.contact.now}</div>
          </div>
          <div>
            <div className="mb-[13px] text-[10px] font-medium tracking-[.18em] text-hi uppercase">Reach</div>
            <div className="flex flex-col gap-[7px] text-[13px] leading-[1.6] text-mid">
              <a href={`mailto:${home.contact.email}`} className="text-hi">
                {home.contact.email}
              </a>
              <span>{home.contact.phone}</span>
              <span>{home.contact.location}</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-edge py-[18px] pb-[22px] text-[10px] tracking-[.14em] text-dim/90 uppercase">
          <span>© 2026 Abdullah Baig · built from scratch</span>
          <a href="#top" className="inline-flex items-center gap-[7px] text-[10px] font-medium tracking-[.16em] text-dim uppercase transition-colors hover:text-hi">
            back to top <span>↑</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
