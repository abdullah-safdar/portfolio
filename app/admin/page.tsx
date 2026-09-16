"use client";

import { useEffect } from "react";

/**
 * Convenience redirect: Tina's admin bundle is a static file at
 * public/admin/index.html (not a Next.js route), so bare /admin 404s.
 * This client-side redirect means /admin just works instead of everyone
 * having to remember the /index.html suffix.
 */
export default function AdminRedirect() {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-mid">
      <p className="m-0">
        Redirecting to the CMS…{" "}
        <a href="/admin/index.html" className="text-hi underline">
          click here
        </a>{" "}
        if nothing happens.
      </p>
    </div>
  );
}
