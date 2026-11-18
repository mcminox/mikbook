import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Demo checkout — MIKBOOK",
  description: "A visual payment simulation. No real payment is made.",
};

export default function DemoCheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
