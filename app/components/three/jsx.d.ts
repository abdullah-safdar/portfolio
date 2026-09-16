import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * Ambient tags for the custom elements registered in register.ts. React 19
 * passes hyphenated intrinsic tags straight through as real custom
 * elements; TypeScript just needs to know they're valid JSX. Augmenting
 * the "react" module (not a bare `declare global` namespace) is required
 * with @types/react 19 — its JSX namespace lives at `React.JSX`, and this
 * merges into that rather than an unused global one.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hero-coder": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "cap-orb": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        shape?: string;
      };
    }
  }
}
