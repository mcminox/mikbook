import type { Metadata } from "next";
import { OriginalSubpage } from "@/components/original/OriginalSubpage";

export const metadata: Metadata = {
  title: "COLLECTION — MIKBOOK",
};

export default function CollectionPage() {
  return <OriginalSubpage title="COLLECTION" />;
}
