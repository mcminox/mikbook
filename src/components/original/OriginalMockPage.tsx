"use client";

import { useSearchParams } from "next/navigation";
import { useState, type PointerEvent as ReactPointerEvent } from "react";

const chapters = [
  "1. OPH", "2. ORL", "3. NEU", "4. PSY", "5. CAR", "6. PNE",
  "7. HGE", "8. URO", "9. NEP", "10. GYN", "11. ORT", "12. RHU",
];

export function OriginalMockPage() {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<"glass" | "watermelon" | "legs" | null>(null);

  const startCrop = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!editMode || !event.ctrlKey) return;
    event.preventDefault();
  };

  return (
    <main className="original-mock">
      <div
        className="original-mock__canvas"
        style={{ transform: `scale(${zoom})` }}
      >
        <aside className="original-mock__left">
          <h1 contentEditable={editMode} suppressContentEditableWarning>MIKBOOK</h1>
          <p contentEditable={editMode} suppressContentEditableWarning>
            Devenir un interne sous-alimenté puis un médecin assigné en justice
            n&apos;est pas facile ; il faut d&apos;abord une dure préparation.
          </p>
          <p contentEditable={editMode} suppressContentEditableWarning>
            Synthèse méthodique du programme des EDN, le MIKBOOK propose aux
            étudiants un outil de mémorisation visuelle et logique des points
            essentiels, s&apos;appuyant sur un graphisme particulier.
          </p>
          <p className="original-mock__cta" contentEditable={editMode} suppressContentEditableWarning>
            <strong>Read the Mikbook</strong><br />
            or just play with it.
          </p>
          <address>
            @mikbook<br />
            Editions Eyrolles<br />
            1 rue Thénard<br />
            75005 Paris<br />
            <u>Follow us on Instagram</u>
          </address>
        </aside>

        <section className="original-mock__middle">
          <header>
            <b contentEditable={editMode} suppressContentEditableWarning>MIKBOOK</b>
            <span>MENU</span>
          </header>
          <div className="original-mock__index">
            {chapters.map((chapter) => (
              <span key={chapter}>{chapter}</span>
            ))}
          </div>
          <div
            className={`original-mock__glass ${selected === "glass" ? "is-selected" : ""}`}
            onPointerDown={(event) => {
              setSelected("glass");
              startCrop(event);
            }}
          >
            <img src="/landing/img-01.jpg" alt="" draggable={false} />
            <p contentEditable={editMode} suppressContentEditableWarning>
              Replace with photo #2 (glame)<br />incendie / red.
            </p>
          </div>
          <div className="original-mock__kline">KLINE</div>
        </section>

        <section className="original-mock__right">
          <div
            className={`original-mock__watermelon ${selected === "watermelon" ? "is-selected" : ""}`}
            onPointerDown={(event) => {
              setSelected("watermelon");
              startCrop(event);
            }}
          >
            <img src="/landing/img-05.jpg" alt="" draggable={false} />
          </div>
          <p
            className="original-mock__caption"
            contentEditable={editMode}
            suppressContentEditableWarning
          >
            Replace with photo #1 (escalator, full width)
          </p>
          <div
            className={`original-mock__legs ${selected === "legs" ? "is-selected" : ""}`}
            onPointerDown={(event) => {
              setSelected("legs");
              startCrop(event);
            }}
          >
            <img src="/landing/img-03.jpg" alt="" draggable={false} />
          </div>
          <div className="original-mock__flower">
            <img src="/landing/img-08.jpg" alt="" draggable={false} />
          </div>
        </section>
      </div>

      {editMode && (
        <aside className="original-mock__panel">
          <div className="flex items-center justify-between">
            <strong>Original editor</strong>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            aria-label="Canvas zoom"
            type="range"
            min="50"
            max="130"
            step="5"
            value={Math.round(zoom * 100)}
            onChange={(event) => setZoom(Number(event.target.value) / 100)}
            className="w-full"
          />
          <p>Selected: {selected ?? "none"}</p>
          <p className="text-[11px] text-black/55">
            Click text to edit directly. Ctrl/Cmd + drag an image to enter crop mode.
          </p>
        </aside>
      )}
    </main>
  );
}
