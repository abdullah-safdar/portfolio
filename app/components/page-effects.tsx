"use client";

import { useEffect } from "react";

/**
 * Module-level (not per-effect-run) cache of each [data-type] element's
 * pristine original children, keyed by element. React's dev-only Strict
 * Mode double-invokes effects — mount, cleanup, mount again — and without
 * this cache the second invocation would re-read `el.childNodes` from the
 * DOM the first (cancelled) invocation had already cleared and partially
 * typed into, permanently truncating the hero text to whatever one
 * character had landed before cleanup fired. Caching the original nodes
 * on first sight makes typeHero() safe to call more than once.
 */
const originalKids = new WeakMap<HTMLElement, Node[]>();

/**
 * Scroll-reveal (fade/translate-in on [data-reveal] elements) and the
 * hero's letter-by-letter typewriter (on [data-type] elements, run in
 * data-type order). Ported from the Claude Design export's
 * componentDidMount/typeHero — same DOM-attribute contract, so the rest
 * of the page stays plain server-rendered markup with these two
 * attributes sprinkled in. Mount once, near the top of the page.
 */
export function PageEffects() {
  useEffect(() => {
    const revealTimers: number[] = [];
    const typeTimers: number[] = [];

    function typeHero() {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-type]")).sort(
        (a, b) => Number(a.dataset.type) - Number(b.dataset.type)
      );
      if (!els.length) return;
      const plans = els.map((el) => {
        let kids = originalKids.get(el);
        if (!kids) {
          kids = Array.from(el.childNodes).map((n) => n.cloneNode(true));
          originalKids.set(el, kids);
        }
        return { el, kids: kids.map((n) => n.cloneNode(true)) };
      });
      plans.forEach(({ el }) => {
        el.textContent = "";
      });

      const speed = (ch: string, base: number) =>
        ch === " " ? base * 0.7 : ch === "\n" ? base * 4 : base + Math.random() * base * 1.2;

      const runNode = (el: HTMLElement, node: Node) =>
        new Promise<void>((res) => {
          const base = Number(el.dataset.typeSpeed || 20);
          if (node.nodeType !== 3) {
            el.appendChild(node);
            return res();
          }
          const text = node.textContent || "";
          const sink = document.createTextNode("");
          el.appendChild(sink);
          let i = 0;
          const step = () => {
            if (i >= text.length) return res();
            sink.textContent += text[i];
            const d = speed(text[i], base);
            i++;
            typeTimers.push(window.setTimeout(step, d));
          };
          step();
        });

      (async () => {
        for (const { el, kids } of plans) {
          for (const k of kids) await runNode(el, k);
          await new Promise<void>((r) => {
            typeTimers.push(window.setTimeout(r, 160));
          });
        }
      })();
    }

    typeHero();

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (nodes.length && "IntersectionObserver" in window) {
      nodes.forEach((n, i) => {
        n.style.opacity = "0";
        n.style.transform = "translateY(18px)";
        const prev = getComputedStyle(n).transition;
        const reveal = "opacity .6s cubic-bezier(.2,.7,.3,1), transform .6s cubic-bezier(.2,.7,.3,1)";
        n.style.transition = prev && prev !== "all 0s ease 0s" ? prev + ", " + reveal : reveal;
        n.style.transitionDelay = (i % 6) * 60 + "ms";
      });
      const show = (n: HTMLElement) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              show(e.target as HTMLElement);
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      nodes.forEach((n) => io.observe(n));
      const fallback = window.setTimeout(() => nodes.forEach(show), 2500);
      revealTimers.push(fallback);

      return () => {
        io.disconnect();
        revealTimers.forEach(clearTimeout);
        typeTimers.forEach(clearTimeout);
      };
    }

    return () => {
      typeTimers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
