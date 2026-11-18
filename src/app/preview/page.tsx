import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "MIKBOOK — preview",
  description: "Preview of the revised MIKBOOK home page.",
};

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[var(--landing-bg)] text-sm text-black/50">
          Loading…
        </div>
      }
    >
      <LandingShell revision />
    </Suspense>
  );
}
