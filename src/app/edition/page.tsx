import type { Metadata } from "next";
import { BookConcept } from "@/components/edition/BookConcept";

export const metadata: Metadata = {
  title: "MIKBOOK — édition",
  description:
    "Découvrez le MIKBOOK à travers une expérience de lecture interactive.",
};

export default function EditionPage() {
  return <BookConcept />;
}
