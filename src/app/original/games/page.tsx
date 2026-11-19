import type { Metadata } from "next";
import { OriginalSubpage } from "@/components/original/OriginalSubpage";

export const metadata: Metadata = {
  title: "GAMES — MIKBOOK",
};

export default function GamesPage() {
  return (
    <OriginalSubpage title="GAMES">
      <p>Games created by interns.</p>
    </OriginalSubpage>
  );
}
