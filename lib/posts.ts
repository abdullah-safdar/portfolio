import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

/**
 * Single source of truth for MDX post data. Consumed by `/writing`,
 * `/writing/[slug]`, the home page's `head -3 writing/` teaser, and
 * `/rss.xml`. No CMS, no database — files under `content/writing/*.mdx`
 * are the only content source.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "writing");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type PostFrontmatter = {
  title: string;
  date: string;
  summary: string;
  topic: string;
  tags: string[];
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

const REQUIRED_FIELDS = ["title", "date", "summary", "topic"] as const;

function slugify(fileName: string): string {
  return fileName
    .replace(/\.mdx$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readPostFile(fileName: string): Post {
  const filePath = path.join(POSTS_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw new Error(
        `content/writing/${fileName} is missing required frontmatter field "${field}"`
      );
    }
  }

  if (typeof data.date !== "string" || !DATE_RE.test(data.date)) {
    throw new Error(
      `content/writing/${fileName} has an invalid "date" field — expected a quoted "YYYY-MM-DD" string, got ${JSON.stringify(data.date)}. An unquoted YAML date parses as a Date object, not a string — quote it.`
    );
  }

  return {
    slug: slugify(fileName),
    frontmatter: {
      title: String(data.title),
      date: data.date,
      summary: String(data.summary),
      topic: String(data.topic),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    },
    content,
  };
}

/** All posts, sorted newest first (ties broken by slug for a stable,
 * deterministic order). Returns an empty array if the content directory
 * doesn't exist or has no `.mdx` files yet — never throws for an empty
 * pipeline itself. (A fully empty `content/writing/` still fails
 * `yarn build` under `output: "export"`, since `/writing/[slug]` then has
 * no static params to generate — see this spec's Implementation Notes.) */
export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map(readPostFile).sort((a, b) => {
    if (a.frontmatter.date !== b.frontmatter.date) {
      return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
    }
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });
});

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** e.g. "Sep 15, 2026" — used everywhere a post date is rendered so
 * formatting can't drift between the index, the post page, and the
 * home page teaser. */
export function formatPostDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

/** e.g. "9 min read" — estimated from word count at 200wpm, floored at 1. */
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
