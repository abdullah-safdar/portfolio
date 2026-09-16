"use client";

import { useEffect } from "react";
import { registerThreeElements } from "./register";
import type { CapabilityShape } from "@/lib/home";

/** Wraps the <cap-orb> custom element — the small 3D glyph on each capability tile. */
export function CapOrb({ shape }: { shape: CapabilityShape }) {
  useEffect(() => {
    registerThreeElements();
  }, []);

  return <cap-orb shape={shape} style={{ position: "absolute", inset: 0 }} />;
}
