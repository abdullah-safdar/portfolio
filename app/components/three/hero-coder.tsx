"use client";

import { useEffect } from "react";
import { registerThreeElements } from "./register";

/** Wraps the <hero-coder> custom element — the hero section's 3D figure. */
export function HeroCoder() {
  useEffect(() => {
    registerThreeElements();
  }, []);

  return <hero-coder style={{ position: "absolute", inset: 0 }} />;
}
