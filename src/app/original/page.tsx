import type { Metadata } from "next";
import { OriginalHomePage } from "@/components/original/OriginalHomePage";

export const metadata: Metadata = {
  title: "MIKBOOK — version originale",
  description: "Version originale du site MIKBOOK.",
};

export default function OriginalPage() {
  return <OriginalHomePage />;
}
