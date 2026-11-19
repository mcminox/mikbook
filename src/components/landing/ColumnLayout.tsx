"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { ColumnId, ImageItem, LandingLayout } from "@/lib/landing/layout-types";
import { useSmoothWheelScroll } from "@/lib/landing/useSmoothWheelScroll";
import { MagnetColumn } from "./MagnetColumn";
import { usePreviewPreferences } from "./PreviewPreferences";
import { RevisionHeader } from "./RevisionHeader";

type Props = {
  layout: LandingLayout;
  editorZoom: number;
  revision?: boolean;
  editMode: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<ImageItem>) => void;
  onColumnWidth: (column: ColumnId, widthPx: number) => void;
};

const CHAPTERS = [
  "OPH", "ORL", "NEU", "PSY", "CAR", "PNE", "HGE", "URO",
  "NEP", "GYN", "ORT", "RHU", "END", "HEM", "PED", "DER",
  "INF", "CAN", "GER", "TOX", "SAN", "THE", "NUT", "EPI",
];

type Language = "FR" | "EN";

function Col1Text({
  revision,
  language,
  onLanguageChange,
}: {
  revision: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  const isFrench = revision ? language === "FR" : true;
  const isFrenchCta = revision && isFrench;

  return (
    <div
      className={`landing-col1-inner${revision ? " landing-col1-inner--revision" : ""}`}
    >
      {!revision && <h1 className="landing-brand">MIKBOOK</h1>}
      <p>
        {isFrench
          ? "Devenir un interne sous-alimenté puis un médecin assigné en justice n'est pas facile ; il faut d'abord une dure préparation."
          : "Becoming an underfed medical intern and then a doctor facing a lawsuit is not easy; first comes some serious preparation."}
      </p>
      <p>
        {isFrench
          ? "Synthèse méthodique du programme des EDN, le MIKBOOK propose aux étudiants un outil de mémorisation visuelle et logique des points essentiels, s'appuyant sur un graphisme particulier et un code de couleurs identique pour chaque item de chaque chapitre, visant à un projet pédagogique global."
          : "A methodical guide to the EDN syllabus, MIKBOOK offers students a visual and logical way to remember essential concepts, using a distinctive graphic language and a consistent colour code throughout every chapter."}
      </p>
      {revision && (
        <nav
          aria-label="Chapter index"
          className="landing-chapters"
          data-chapter-index
        >
          {CHAPTERS.map((chapter, index) => (
            <span className="landing-chapters__item" key={chapter}>
              <span>{index + 1}.</span> {chapter}
            </span>
          ))}
        </nav>
      )}
      <p className="landing-cta">
        <strong>{isFrenchCta ? "Lire le Mikbook" : "Read the Mikbook"}</strong>
        <br />
        {isFrenchCta ? "ou simplement jouer avec." : "or just play with it."}
      </p>
      <address className="landing-meta not-italic">
        @mikbook
        <br />
        Editions Eyrolles
        <br />
        1 rue Thénard
        <br />
        75005 Paris
        <br />
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          {isFrenchCta ? "Suivez-nous sur Instagram" : "Follow us on Instagram"}
        </a>
      </address>
      {revision && (
        <div aria-label="Language" className="landing-language-switch">
          {(["FR", "EN"] as const).map((option) => (
            <button
              aria-pressed={language === option}
              key={option}
              onClick={() => onLanguageChange(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Col2Intro({ language }: { language: Language }) {
  return (
    <div className="landing-col2-intro relative z-[5] px-2 pb-4 pt-1">
      <p className="text-[11px] leading-snug text-black/70">
        {language === "FR" ? "La grotte secrète" : "The Secret Cave"}
        <br />
        {language === "FR" ? "Pavillon aquatique" : "Water Pavilion"}
      </p>
    </div>
  );
}

export function ColumnLayout({
  layout,
  editorZoom,
  revision = false,
  editMode,
  selectedId,
  onSelect,
  onChange,
  onColumnWidth,
}: Props) {
  const { col1, col2: w2, col3: w3 } = layout.columnWidths;
  const editorExtentScale = Math.max(1, editorZoom);
  const editorOffset = `${Math.max(0, (1 - editorZoom) * 50)}`;
  const [language, setLanguage] = useState<Language>("EN");
  const { preferences } = usePreviewPreferences();
  const smoothScroll = revision && !editMode && preferences.smoothScroll;
  const firstColumnRef = useSmoothWheelScroll<HTMLElement>(smoothScroll);
  const col1Text = (
    <Col1Text
      revision={revision}
      language={revision ? language : "FR"}
      onLanguageChange={setLanguage}
    />
  );
  const scrollToChapterIndex = () => {
    const indexes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter-index]"),
    );
    const visibleIndex = indexes.find((index) => index.getClientRects().length > 0);
    visibleIndex?.scrollIntoView({
      behavior: preferences.smoothScroll ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <div
      className={`min-h-dvh bg-[var(--landing-bg)] text-[var(--landing-fg)]${revision ? " landing-revision" : ""}`}
      onClick={() => {
        if (editMode) onSelect(null);
      }}
    >
      {revision && (
        <RevisionHeader
          menuHref="/preview"
          onMenuClick={scrollToChapterIndex}
        />
      )}
      <div
        className={`landing-editor-viewport${editMode ? " landing-editor-viewport--active" : ""}`}
      >
        <div
          className={`landing-editor-extent${editMode ? " landing-editor-extent--active" : ""}`}
          style={
            editMode
              ? {
                  width: `${editorExtentScale * 100}%`,
                  height: `${editorExtentScale * 100}dvh`,
                }
              : undefined
          }
        >
          <div
            className={`landing-columns h-dvh overflow-hidden${editMode ? " landing-editor-surface" : ""}`}
            style={
              {
                "--landing-grid-columns": `${col1} ${w2} ${w3}`,
                ...(editMode
                  ? {
                      width: `${100 / editorExtentScale}%`,
                      height: `${100 / editorExtentScale}dvh`,
                      left: `${editorOffset}%`,
                      top: `${editorOffset}dvh`,
                      transform: `scale(${editorZoom})`,
                    }
                  : {}),
              } as CSSProperties
            }
          >
        <aside
          ref={firstColumnRef}
          className={`min-w-0 overflow-x-hidden overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${revision ? " landing-revision__column-one" : ""}${editMode ? " landing-editor-column" : ""}`}
        >
          {col1Text}
        </aside>

        <MagnetColumn
          column={2}
          images={layout.images}
          contentHeight={layout.contentHeight}
          editMode={editMode}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
          onColumnWidth={onColumnWidth}
          smoothScroll={smoothScroll}
          header={<Col2Intro language={revision ? language : "EN"} />}
          className={`min-w-0 overflow-x-hidden overflow-y-auto border-l border-black/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${editMode ? " landing-editor-column" : ""}`}
        />

        <MagnetColumn
          column={3}
          images={layout.images}
          contentHeight={layout.contentHeight}
          editMode={editMode}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
          onColumnWidth={onColumnWidth}
          smoothScroll={smoothScroll}
          className={`min-w-0 overflow-x-hidden overflow-y-auto border-l border-black/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${editMode ? " landing-editor-column" : ""}`}
        />
          </div>
        </div>
      </div>

      <div className="block min-[760px]:hidden">
        <section
          className={`border-b border-black/10 p-5${revision ? " landing-revision__mobile-column-one" : ""}`}
        >
          {col1Text}
        </section>
        <MagnetColumn
          column={2}
          images={layout.images}
          contentHeight={Math.min(layout.contentHeight, 1400)}
          editMode={editMode}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
          onColumnWidth={onColumnWidth}
          smoothScroll={smoothScroll}
          header={<Col2Intro language={revision ? language : "EN"} />}
          className="relative border-b border-black/10"
        />
        <MagnetColumn
          column={3}
          images={layout.images}
          contentHeight={Math.min(layout.contentHeight, 1400)}
          editMode={editMode}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
          onColumnWidth={onColumnWidth}
          smoothScroll={smoothScroll}
          className="relative"
        />
      </div>
    </div>
  );
}
