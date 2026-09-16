import type { Metadata } from "next";
import type { ComponentProps } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Theme } from "rehype-pretty-code";
import shikiTheme from "@/content/shiki-theme.json";
import { getAllPosts, getPostBySlug, formatPostDate, readingTime } from "@/lib/posts";
import { ReadingProgress } from "../reading-progress";

// Static export can't serve unlisted params at request time (no server
// at runtime) — every slug must come from `generateStaticParams` below.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.frontmatter.title} — Abdullah Baig`,
    description: post.frontmatter.summary,
  };
}

// Never a stock Shiki theme — this is the repo's own monochrome JSON
// (content/shiki-theme.json), mapped to the site's theme tokens.
const theme = shikiTheme as unknown as Theme;

// Prose bodies use Plex Sans (font-sans) while headings stay mono, per the
// post type scale. `figure`/`figcaption` handle rehype-pretty-code's
// title bar (```ts title="..."``` in the MDX source) — see the writing
// redesign plan for why the border/background live on `figure`, not `pre`.
const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="mt-3.5 mb-0 text-[length:clamp(18px,2.1vw,25px)] leading-[1.24] font-bold tracking-[-.035em] text-[#f6f5f3]"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="m-0 text-[14.5px] leading-[1.85] text-fg/[.76]" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="m-0 border-l-2 border-accent bg-accent/[.08] px-5 py-4.5 text-[length:clamp(15px,1.6vw,19px)] leading-[1.55] font-medium tracking-[-.02em] text-[#efeaff]"
      {...props}
    />
  ),
  figure: (props: ComponentProps<"figure">) => (
    <figure className="overflow-hidden rounded border border-edge bg-[#131317]" {...props} />
  ),
  figcaption: (props: ComponentProps<"figcaption">) => (
    <figcaption
      className="flex items-center gap-2 border-b border-edge bg-fg/[.02] px-[13px] py-2.5 text-[10px] tracking-[.1em] text-dim"
      {...props}
    >
      <span className="size-1.5 rounded-full bg-accent" />
      {props.children}
    </figcaption>
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre className="m-0 overflow-x-auto px-[15px] py-4 font-mono text-[12px] leading-[1.75] text-fg/[.82]" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="font-mono text-[0.9em] text-fg" {...props} />
  ),
};

export default async function PostPage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const related = [
    ...all.filter((p) => p.slug !== post.slug && p.frontmatter.topic === post.frontmatter.topic),
    ...all.filter((p) => p.slug !== post.slug && p.frontmatter.topic !== post.frontmatter.topic),
  ].slice(0, 3);

  return (
    <article id="top">
      <ReadingProgress />

      <section className="relative overflow-hidden px-[clamp(18px,4vw,60px)] py-[clamp(40px,5vw,72px)] pb-[clamp(26px,3vw,40px)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 64% at 24% 12%,rgba(139,118,224,.13),transparent 70%)" }}
        />
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-[18px]">
          <Link
            href="/writing"
            className="w-fit rounded-[3px] border border-fg/[.12] bg-fg/[.03] px-3 py-2 text-[10px] font-medium tracking-[.16em] text-fg/70 uppercase transition-colors hover:text-fg"
          >
            ← all posts
          </Link>
          <span className="text-[10.5px] font-medium tracking-[.2em] text-hi uppercase">
            {post.frontmatter.topic} · {formatPostDate(post.frontmatter.date)} · {readingTime(post.content)}
          </span>
          <h1 className="m-0 text-[length:clamp(27px,4.4vw,50px)] leading-[1.08] font-bold tracking-[-.05em] text-[#f6f5f3]">
            {post.frontmatter.title}
          </h1>
          <p className="m-0 text-[length:clamp(14px,1.2vw,16.5px)] leading-[1.7] text-fg/70">
            {post.frontmatter.summary}
          </p>
        </div>
      </section>

      <div className="px-[clamp(18px,4vw,60px)]">
        <div
          className="mx-auto h-px max-w-[760px]"
          style={{ background: "linear-gradient(90deg,rgba(167,139,250,.6),rgba(255,255,255,.07) 60%,transparent)" }}
        />
      </div>

      <section className="px-[clamp(18px,4vw,60px)] py-[clamp(34px,4.4vw,60px)] pb-[clamp(40px,5vw,70px)]">
        <div className="mx-auto flex max-w-[760px] min-w-0 flex-col gap-[22px] font-sans">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [rehypePrettyCode, { theme, keepBackground: false }],
                ],
              },
            }}
          />

          {post.frontmatter.tags.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-edge pt-6">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-fg/[.14] px-[9px] py-[7px] text-[10px] font-medium tracking-[.12em] text-fg/70 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3.5 flex items-center gap-4 rounded border border-edge bg-[linear-gradient(180deg,rgba(255,255,255,.022),transparent)] p-[18px]">
            <div
              aria-hidden="true"
              className="flex size-[72px] flex-none items-center justify-center rounded-full border border-accent-soft/40 bg-accent-soft/10 text-[18px] font-bold tracking-[.04em] text-hi"
            >
              AB
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="text-[13px] font-bold tracking-[-.01em] text-[#f6f5f3]">Abdullah Baig</span>
              <span className="text-[11.5px] leading-[1.6] text-mid">
                Lead software engineer — event-driven backends, AI automation and Web3. Islamabad, remote-first.
              </span>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="px-[clamp(18px,4vw,60px)] pb-[clamp(48px,6vw,84px)]">
          <div className="mx-auto max-w-[1080px]">
            <span className="mb-[18px] block text-[10px] font-medium tracking-[.24em] text-fg/60 uppercase">
              keep reading
            </span>
            <div className="grid grid-cols-1 gap-[clamp(14px,2vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/writing/${p.slug}`}
                  className="flex min-w-0 flex-col gap-[11px] rounded border border-edge bg-[linear-gradient(180deg,rgba(255,255,255,.022),transparent)] p-[18px] transition-[border-color,transform] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-[3px] hover:border-accent/50"
                >
                  <span className="text-[10px] font-medium tracking-[.18em] text-hi uppercase">
                    {p.frontmatter.topic} · {readingTime(p.content)}
                  </span>
                  <span className="text-[15.5px] leading-[1.32] font-bold tracking-[-.025em] text-[#f6f5f3]">
                    {p.frontmatter.title}
                  </span>
                  <span className="text-[12px] leading-[1.65] text-fg/62">{p.frontmatter.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
