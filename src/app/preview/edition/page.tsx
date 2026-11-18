import type { Metadata } from "next";
import { BookConcept } from "@/components/edition/BookConcept";

export const metadata: Metadata = {
  title: "MIKBOOK — interactive edition",
  description: "Explore MIKBOOK in an interactive reading experience.",
};

export default function PreviewEditionPage() {
  return <BookConcept revision />;
}
