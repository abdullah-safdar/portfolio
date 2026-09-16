import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable.
// NEXT_PUBLIC_TINA_BRANCH lets the site owner pin it explicitly; otherwise
// fall back to whatever the host injects, then "main".
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default defineConfig({
  branch,

  // From app.tina.io -> Overview tab
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // From app.tina.io -> Tokens tab (Read Only Token)
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  schema: {
    collections: [
      {
        name: "writing",
        label: "Writing",
        path: "content/writing",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          // Deliberately a plain string, not Tina's native `datetime` field:
          // `datetime` always persists a full ISO 8601 UTC timestamp
          // regardless of dateFormat/timeFormat UI settings (those only
          // change the editor's display, not what's written to frontmatter).
          // lib/posts.ts requires a quoted "YYYY-MM-DD" string, so the field
          // that edits `date` has to be a string field that round-trips
          // exactly what's typed.
          {
            type: "string",
            name: "date",
            label: "Date",
            required: true,
            description: 'Format: YYYY-MM-DD (e.g. "2026-09-15")',
            ui: {
              validate: (value) => {
                if (!value || !DATE_RE.test(value)) {
                  return 'Date must be in "YYYY-MM-DD" format';
                }
                // DATE_RE only checks the shape -- also reject calendar-invalid
                // values like "2026-13-45" that would otherwise round-trip
                // into an "Invalid Date" wherever this post's date is shown.
                const [y, m, d] = value.split("-").map(Number);
                const parsed = new Date(Date.UTC(y, m - 1, d));
                if (
                  parsed.getUTCFullYear() !== y ||
                  parsed.getUTCMonth() !== m - 1 ||
                  parsed.getUTCDate() !== d
                ) {
                  return "Date must be a real calendar date";
                }
              },
            },
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          // Single category for the /writing index's topic filter and each
          // card's label — distinct from `tags`, which are the free-form
          // tech chips shown at the bottom of the post itself.
          {
            type: "string",
            name: "topic",
            label: "Topic",
            required: true,
            description: 'Single category, e.g. "Architecture" or "Practice"',
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          // Plain markdown/MDX string, not Tina's `rich-text` AST type --
          // next-mdx-remote/rsc keeps compiling this exactly as before.
          {
            type: "string",
            name: "body",
            label: "Body",
            isBody: true,
            required: true,
          },
        ],
      },
      {
        name: "home",
        label: "Home Page",
        path: "content",
        format: "json",
        match: {
          include: "home",
        },
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            required: true,
            fields: [
              {
                type: "string",
                name: "kicker",
                label: "Kicker line",
                required: true,
                description: 'Small line above the headline, e.g. "~/abdullah $ whoami — lead full stack engineer"',
              },
              {
                type: "string",
                name: "intro",
                label: "Intro paragraph",
                required: true,
                ui: { component: "textarea" },
              },
              { type: "string", name: "github", label: "GitHub URL", required: true },
              { type: "string", name: "linkedin", label: "LinkedIn URL", required: true },
            ],
          },
          {
            type: "string",
            name: "ticker",
            label: "Ticker (scrolling skills strip)",
            list: true,
          },
          {
            type: "object",
            name: "stats",
            label: "Stats",
            list: true,
            fields: [
              { type: "string", name: "idx", label: "Index", required: true, description: 'e.g. "01"' },
              { type: "string", name: "tag", label: "Tag", required: true },
              { type: "string", name: "n", label: "Number", required: true },
              { type: "string", name: "unit", label: "Unit", required: true },
              {
                type: "string",
                name: "bar",
                label: "Bar fill",
                required: true,
                description: 'Percentage, e.g. "70%"',
              },
              {
                type: "string",
                name: "label",
                label: "Label",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "object",
            name: "projects",
            label: "Selected work",
            list: true,
            fields: [
              { type: "string", name: "num", label: "Number", required: true, description: 'e.g. "01"' },
              { type: "string", name: "name", label: "Name", isTitle: true, required: true },
              {
                type: "object",
                name: "flow",
                label: "Flow steps",
                list: true,
                fields: [
                  { type: "string", name: "n", label: "Step label", required: true },
                  { type: "boolean", name: "a", label: "Show arrow before this step" },
                ],
              },
              { type: "string", name: "path", label: "Path label", required: true, description: 'e.g. "~/work/phron-ai"' },
              { type: "string", name: "year", label: "Year", required: true },
              {
                type: "string",
                name: "metric",
                label: "Highlight metric",
                required: true,
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "blurb",
                label: "Description",
                required: true,
                ui: { component: "textarea" },
              },
              { type: "string", name: "tags", label: "Tags", list: true },
            ],
          },
          {
            type: "object",
            name: "caps",
            label: "Capabilities",
            list: true,
            fields: [
              { type: "string", name: "idx", label: "Index", required: true, description: 'e.g. "01"' },
              {
                type: "string",
                name: "shape",
                label: "Orb shape",
                required: true,
                options: ["frontend", "backend", "distributed", "cloud", "ai", "web3"],
              },
              { type: "string", name: "label", label: "Label", isTitle: true, required: true },
              {
                type: "string",
                name: "note",
                label: "Note",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "object",
            name: "skillGroups",
            label: "Skill groups",
            list: true,
            fields: [
              { type: "string", name: "title", label: "Title", isTitle: true, required: true },
              {
                type: "string",
                name: "items",
                label: "Items line",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "object",
            name: "roles",
            label: "Experience",
            list: true,
            fields: [
              { type: "string", name: "title", label: "Title", isTitle: true, required: true },
              { type: "string", name: "company", label: "Company", required: true },
              {
                type: "string",
                name: "years",
                label: "Year(s)",
                required: true,
                description: 'Free text, e.g. "2022 — Present"',
              },
              { type: "string", name: "points", label: "Bullet points", list: true },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact",
            required: true,
            fields: [
              { type: "string", name: "email", label: "Email", required: true },
              { type: "string", name: "phone", label: "Phone", required: true },
              { type: "string", name: "location", label: "Location", required: true },
              {
                type: "string",
                name: "education",
                label: "Education",
                required: true,
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "now",
                label: "Now (footer blurb)",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },
});
