import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is prerendered HTML/CSS/JS, no Node server
  // at runtime. Matches the build spec's "static output" stack decision.
  output: "export",
};

export default nextConfig;
