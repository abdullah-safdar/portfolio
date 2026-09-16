import { WritingHeader } from "../components/writing-header";
import { WritingFooter } from "../components/writing-footer";

/**
 * Shared shell for `/writing` and `/writing/[slug]`, matching the Claude
 * Design writing-page redesign (see the home page redesign plan's writing
 * follow-up). Full-width sections manage their own max-width internally,
 * same pattern as the home page — unlike the old narrow single-column
 * layout this replaces.
 */
export default function WritingLayout({ children }: LayoutProps<"/writing">) {
  return (
    <div className="min-w-0 bg-bg text-fg [&_a]:no-underline">
      <WritingHeader />
      {children}
      <WritingFooter />
    </div>
  );
}
