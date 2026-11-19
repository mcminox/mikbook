import type { ReactNode } from "react";
import { OriginalSiteLayout } from "@/components/original/OriginalSiteLayout";
import "../original.css";

export default function OriginalLayout({ children }: { children: ReactNode }) {
  return <OriginalSiteLayout>{children}</OriginalSiteLayout>;
}
