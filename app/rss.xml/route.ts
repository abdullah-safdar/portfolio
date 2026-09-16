import { getAllPosts } from "@/lib/posts";

// Static Route Handler: prerendered at build time, same as every other
// route on this site (output: "export").
export const dynamic = "force-static";

const SITE_URL = "https://abdullah.dev";
const SITE_TITLE = "Abdullah Baig — Writing";
const SITE_DESCRIPTION =
  "Long-form posts on backend systems, AI agents, and on-chain integration.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/writing/${post.slug}`;
      const pubDate = new Date(`${post.frontmatter.date}T00:00:00Z`).toUTCString();

      return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.frontmatter.summary)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
