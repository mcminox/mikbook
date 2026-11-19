import type { Metadata } from "next";
import { OriginalSubpage } from "@/components/original/OriginalSubpage";

export const metadata: Metadata = {
  title: "VIDEOS — MIKBOOK",
};

export default function VideosPage() {
  return (
    <OriginalSubpage title="VIDEOS">
      <p className="original-video-title">
        <span>Opérer en s&apos;amusant</span>
        <span
          className="original-age-mark"
          role="img"
          aria-label="Interdit aux moins de 18 ans"
        >
          −18
        </span>
      </p>
    </OriginalSubpage>
  );
}
