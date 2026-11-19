import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OriginalSubpage } from "@/components/original/OriginalSubpage";

const chapters = [
  "OBS", "ORL", "NEU", "PSY", "CAR", "PNE", "HÉP", "GAS", "NÉP", "GYN",
  "ORT", "RHU", "END", "S-MÉ", "PÉD", "DER", "MIN", "CAN", "USP", "RÉT",
  "SPU", "THÉ", "NUT", "EPI",
];

type Props = {
  params: Promise<{ number: string }>;
};

export function generateStaticParams() {
  return chapters.map((_, index) => ({ number: String(index + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const chapterNumber = Number(number);
  const code = chapters[chapterNumber - 1];
  return {
    title: code ? `(${chapterNumber}) ${code} — MIKBOOK` : "Chapitre — MIKBOOK",
  };
}

export default async function ChapterPage({ params }: Props) {
  const { number } = await params;
  const chapterNumber = Number(number);
  const code = chapters[chapterNumber - 1];
  if (!Number.isInteger(chapterNumber) || !code) notFound();

  if (chapterNumber === 15) {
    return (
      <OriginalSubpage
        title={
          <>
            (15) <strong>PÉD</strong>IATRIE
          </>
        }
      />
    );
  }

  return <OriginalSubpage title={`(${chapterNumber}) ${code}`} />;
}
