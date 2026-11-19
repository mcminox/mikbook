import type { Metadata } from "next";
import { OriginalSubpage } from "@/components/original/OriginalSubpage";

export const metadata: Metadata = {
  title: "SERIOUS GAMES — MIKBOOK",
};

export default function SeriousGamesPage() {
  return (
    <OriginalSubpage title="SERIOUS GAMES">
      <p>Games created by interns.</p>
    </OriginalSubpage>
  );
}
