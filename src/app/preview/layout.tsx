import { Inter, Jost } from "next/font/google";
import type { ReactNode } from "react";
import { PreviewPreferencesProvider } from "@/components/landing/PreviewPreferences";

const logoFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-revision-logo",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-revision-body",
});

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className={`revision-preview ${logoFont.variable} ${bodyFont.variable}`}>
      <PreviewPreferencesProvider>{children}</PreviewPreferencesProvider>
    </div>
  );
}
