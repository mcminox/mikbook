"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { RevisionHeader } from "@/components/landing/RevisionHeader";

type Spread = {
  chapter: string;
  title: string;
  intro: string;
  note: string;
  english: {
    chapter: string;
    title: string;
    intro: string;
    note: string;
    photo: { alt: string; caption: string };
  };
  page: number;
  photo: {
    src: string;
    alt: string;
    caption: string;
    creator: string;
    source: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
  };
};

const SPREADS: Spread[] = [
  {
    chapter: "01 — VENTILATION",
    title: "L’air entre.\nLe thorax s’ouvre.",
    intro:
      "À l’inspiration, le diaphragme se contracte et s’abaisse. Le volume de la cage thoracique augmente ; la pression dans les poumons diminue légèrement et l’air y pénètre.",
    note:
      "Au repos, l’expiration est généralement passive : le diaphragme se relâche et l’élasticité pulmonaire ramène l’air vers l’extérieur.",
    english: {
      chapter: "01 — BREATHING",
      title: "Air flows in.\nThe chest expands.",
      intro:
        "When you breathe in, the diaphragm contracts and moves down. The chest cavity expands, slightly lowering pressure in the lungs and drawing air in.",
      note:
        "At rest, breathing out is usually passive: the diaphragm relaxes and the lungs’ elasticity pushes air back out.",
      photo: {
        alt: "Frontal chest X-ray showing the lungs, ribs and heart.",
        caption: "Frontal chest X-ray — the lung fields and the outline of the heart.",
      },
    },
    page: 14,
    photo: {
      src: "/edition/chest-xray-pa.jpg",
      alt: "Radiographie thoracique de face montrant les poumons, les côtes et le cœur.",
      caption:
        "Radiographie thoracique de face — les champs pulmonaires et la silhouette cardiaque.",
      creator: "O’Dea",
      source: "Wikimedia Commons, Chest x-ray — posteroanterior view",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Chest_x-ray_-_posteroanterior_view.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
  {
    chapter: "02 — ANATOMIE",
    title: "Lire le thorax\nde profil.",
    intro:
      "Une radiographie de profil complète la vue de face. Deux projections aident à situer les structures dans l’espace, du sternum en avant aux vertèbres en arrière.",
    note:
      "Un cliché est une projection : les structures traversées par les rayons se superposent sur l’image.",
    english: {
      chapter: "02 — ANATOMY",
      title: "Read the chest\nin profile.",
      intro:
        "A side-view X-ray complements the frontal view. Together, the two projections help locate structures in space, from the sternum at the front to the vertebrae at the back.",
      note:
        "An X-ray is a projection: structures crossed by the rays overlap in the image.",
      photo: {
        alt: "Lateral chest X-ray showing the thorax from the side.",
        caption: "Lateral chest X-ray — a second view of the same chest.",
      },
    },
    page: 16,
    photo: {
      src: "/edition/chest-xray-lateral.jpg",
      alt: "Radiographie thoracique de profil, vue latérale du thorax.",
      caption:
        "Radiographie thoracique de profil — une seconde projection du même thorax.",
      creator: "O’Dea",
      source: "Wikimedia Commons, Chest x-ray — lateral view",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Chest_x-ray_-_lateral_view.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
  {
    chapter: "03 — MICROSCOPIE",
    title: "À la frontière\ndu sang et de l’air.",
    intro:
      "Dans les alvéoles, une paroi très fine sépare l’air du sang des capillaires. L’oxygène diffuse vers le sang ; le dioxyde de carbone suit le trajet inverse.",
    note:
      "La diffusion dépend des gradients de pression partielle et de la finesse de la membrane alvéolo-capillaire.",
    english: {
      chapter: "03 — MICROSCOPY",
      title: "At the boundary\nof blood and air.",
      intro:
        "In the alveoli, a very thin wall separates the air from the blood in the capillaries. Oxygen diffuses into the blood; carbon dioxide travels in the opposite direction.",
      note:
        "Diffusion depends on partial-pressure gradients and the thinness of the alveolar–capillary membrane.",
      photo: {
        alt: "Stained lung tissue micrograph showing the parenchyma and alveoli.",
        caption:
          "Stained lung tissue — parenchyma and alveoli viewed under a microscope.",
      },
    },
    page: 18,
    photo: {
      src: "/edition/lung-histology.webp",
      alt: "Micrographie de tissu pulmonaire coloré, montrant le parenchyme et les alvéoles.",
      caption:
        "Tissu pulmonaire coloré en histologie — parenchyme et alvéoles observés au microscope.",
      creator: "C. L. Walsh et al.",
      source: "Nature Methods (2021), via Wikimedia Commons",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Histological_staining_following_imaging_of_lung_tissue_of_BM05.webp",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    },
  },
];

function PhotoCaption({
  photo,
  caption,
  revision,
}: {
  photo: Spread["photo"];
  caption: string;
  revision: boolean;
}) {
  return (
    <figcaption className="book-photo__caption">
      <span>{caption}</span>
      <span>
        {revision ? "Photo:" : "Photo :"} {photo.creator} ·{" "}
        {revision ? "image resized for web" : "image redimensionnée pour le web"} ·{" "}
        <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">
          {photo.source}
        </a>{" "}
        ·{" "}
        <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">
          {photo.license}
        </a>
      </span>
    </figcaption>
  );
}

function ChapterLabel({ value, revision }: { value: string; revision: boolean }) {
  if (!revision) return value;
  const separator = value.indexOf(" — ");
  if (separator < 0) {
    return <><strong>{value.slice(0, 3)}</strong>{value.slice(3)}</>;
  }
  const titleStart = separator + 3;
  const title = value.slice(titleStart);
  return (
    <>
      {value.slice(0, titleStart)}
      <strong>{title.slice(0, 3)}</strong>
      {title.slice(3)}
    </>
  );
}

export function BookConcept({ revision = false }: { revision?: boolean }) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [turnDirection, setTurnDirection] = useState<"next" | "previous" | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"spread" | "a4">("spread");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const readerRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const spread = SPREADS[spreadIndex];
  const copy = revision ? spread.english : spread;
  const photoAlt = revision ? spread.english.photo.alt : spread.photo.alt;
  const photoCaption = revision ? spread.english.photo.caption : spread.photo.caption;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === readerRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const turnPage = useCallback(
    (direction: "next" | "previous") => {
      if (turnDirection) return;
      const nextIndex =
        direction === "next"
          ? Math.min(spreadIndex + 1, SPREADS.length - 1)
          : Math.max(spreadIndex - 1, 0);
      if (nextIndex === spreadIndex) return;

      setTurnDirection(direction);
      timers.current.push(
        window.setTimeout(() => setSpreadIndex(nextIndex), 300),
        window.setTimeout(() => setTurnDirection(null), 650),
      );
    },
    [spreadIndex, turnDirection],
  );

  const toggleFullscreen = useCallback(async () => {
    setFullscreenError(null);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (readerRef.current?.requestFullscreen) {
        await readerRef.current.requestFullscreen();
      } else {
        throw new Error("Fullscreen is not supported by this browser.");
      }
    } catch (error) {
      setFullscreenError(
        error instanceof Error
          ? revision
            ? "Fullscreen could not be enabled in this browser."
            : "Le plein écran n’a pas pu être activé dans ce navigateur."
          : revision
            ? "Fullscreen could not be enabled."
            : "Impossible d’activer le plein écran.",
      );
    }
  }, [revision]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight") turnPage("next");
      if (event.key === "ArrowLeft") turnPage("previous");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [turnPage]);

  return (
    <main className={`book-concept${revision ? " book-concept--revision" : ""}`}>
      <div
        aria-hidden="true"
        className={`book-preloader ${isLoading ? "" : "book-preloader--hidden"}`}
      >
        <div className="book-preloader__mark">
          <span />
          <span />
        </div>
        <p>MIKBOOK</p>
        <span className="book-preloader__caption">
          {revision ? "OPEN THE BOOK" : "OUVRIR LE LIVRE"}
        </span>
      </div>

      {revision ? (
        <RevisionHeader menuHref="/preview" />
      ) : (
        <header className="book-topbar">
          <Link aria-label="MIKBOOK, accueil" className="book-wordmark" href="/edition">
            MIKBOOK<span>®</span>
          </Link>
          <span className="book-topbar__edition">ÉDITION INTERACTIVE · 2026</span>
          <Link className="book-topbar__back" href="/">
            Voir la première version <span aria-hidden="true">↗</span>
          </Link>
        </header>
      )}

      <section className="book-intro">
        <div className="book-intro__copy">
          <p className="book-eyebrow">
            {revision ? "KNOWLEDGE TAKES SHAPE" : "LE SAVOIR PREND FORME"}
          </p>
          <h1>
            {revision ? "Understand." : "Comprendre."}
            <br />
            <em>{revision ? "Remember differently." : "Retenir autrement."}</em>
          </h1>
        </div>
        <p className="book-intro__note">
          {revision ? "Precise facts, real images." : "Des faits précis, des images réelles."}
          <br />
          {revision
            ? "Explore an excerpt about breathing."
            : "Feuilletez un extrait consacré à la respiration."}
        </p>
      </section>

      <section
        aria-label={revision ? "Interactive book excerpt" : "Extrait interactif du livre"}
        className="book-reader"
        ref={readerRef}
      >
        <div className="book-reader__bar">
          <span className="book-reader__chapter">{copy.chapter}</span>
          <div className="book-reader__tools">
            <div
              aria-label={revision ? "Reading format" : "Format de lecture"}
              className="book-view-toggle"
            >
              <button
                aria-pressed={viewMode === "spread"}
                className={viewMode === "spread" ? "book-view-toggle__active" : ""}
                onClick={() => setViewMode("spread")}
                type="button"
              >
                {revision ? "OPEN SPREAD" : "OUVERT"}
              </button>
              <button
                aria-pressed={viewMode === "a4"}
                className={viewMode === "a4" ? "book-view-toggle__active" : ""}
                onClick={() => setViewMode("a4")}
                type="button"
              >
                A4
              </button>
            </div>
            <button
              aria-label={
                revision
                  ? isFullscreen
                    ? "Exit fullscreen"
                    : "Fullscreen"
                  : isFullscreen
                    ? "Quitter le plein écran"
                    : "Plein écran"
              }
              className="book-fullscreen"
              onClick={toggleFullscreen}
              type="button"
            >
              <span aria-hidden="true">{isFullscreen ? "↙" : "⛶"}</span>
              {revision
                ? isFullscreen
                  ? "CLOSE"
                  : "FULLSCREEN"
                : isFullscreen
                  ? "FERMER"
                  : "PLEIN ÉCRAN"}
            </button>
          </div>
        </div>
        {fullscreenError && (
          <p aria-live="polite" className="book-fullscreen-error">
            {fullscreenError}
          </p>
        )}

        <div
          aria-live="polite"
          className={[
            "book-spread",
            viewMode === "a4" ? "book-spread--a4" : "",
            turnDirection ? `book-spread--turn-${turnDirection}` : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {viewMode === "a4" ? (
            <article className="book-page book-page--a4">
              <div className="book-page__topline">
                <span>{revision ? "MIKBOOK · BREATHING" : "MIKBOOK · RESPIRATION"}</span>
                <span>
                  {revision ? "CHAPTER" : "CHAPITRE"}{" "}
                  {String(spreadIndex + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="book-a4__copy" key={`a4-${spreadIndex}`}>
                <p className={`book-a4__eyebrow${revision ? " book-a4__eyebrow--revision" : ""}`}>
                  <ChapterLabel revision={revision} value={copy.chapter} />
                </p>
                <h2>{copy.title}</h2>
                <p className="book-a4__intro">{copy.intro}</p>
                <figure className="book-photo book-photo--a4">
                  <div className="book-photo__image">
                    <Image
                      alt={photoAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 35vw"
                      src={spread.photo.src}
                    />
                  </div>
                  <PhotoCaption
                    photo={spread.photo}
                    caption={photoCaption}
                    revision={revision}
                  />
                </figure>
                <aside className="book-a4__note">
                  <span className="book-margin-note__symbol" aria-hidden="true">
                    ✳
                  </span>
                  <p>{copy.note}</p>
                </aside>
              </div>
              <span className="book-page__number">{spread.page}</span>
            </article>
          ) : (
            <>
              <article className="book-page book-page--text">
                <div className="book-page__topline">
                  <span>{revision ? "MIKBOOK · BREATHING" : "MIKBOOK · RESPIRATION"}</span>
                  <span>
                    {revision ? "CHAPTER" : "CHAPITRE"}{" "}
                    {String(spreadIndex + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="book-page__copy" key={`copy-${spreadIndex}`}>
                  <p className={`book-page__eyebrow${revision ? " book-page__eyebrow--revision" : ""}`}>
                    <ChapterLabel revision={revision} value={copy.chapter} />
                  </p>
                  <h2>{copy.title}</h2>
                  <p>{copy.intro}</p>
                  <div className="book-margin-note">
                    <span className="book-margin-note__symbol" aria-hidden="true">
                      ✳
                    </span>
                    <p>{copy.note}</p>
                  </div>
                </div>
                <span className="book-page__number">{spread.page}</span>
              </article>

              <article className="book-page book-page--illustration">
                <div className="book-page__topline">
                  <span>FIG. {String(spreadIndex + 1).padStart(2, "0")}</span>
                  <span>{revision ? "SEE · UNDERSTAND" : "À VOIR · À SAVOIR"}</span>
                </div>
                <figure className="book-photo" key={`photo-${spreadIndex}`}>
                  <div className="book-photo__image">
                    <Image
                      alt={photoAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      src={spread.photo.src}
                    />
                  </div>
                  <PhotoCaption
                    photo={spread.photo}
                    caption={photoCaption}
                    revision={revision}
                  />
                </figure>
                <span className="book-page__number">{spread.page + 1}</span>
              </article>
            </>
          )}

          {turnDirection && viewMode === "spread" && (
            <div aria-hidden="true" className="book-turn-sheet">
              <span>MIKBOOK</span>
            </div>
          )}
        </div>

        <div className="book-controls">
          <span className="book-controls__count">
            <strong>{String(spreadIndex + 1).padStart(2, "0")}</strong>
            <span> / {String(SPREADS.length).padStart(2, "0")}</span>
          </span>
          <div
            aria-label={revision ? "Choose a chapter" : "Choisir un chapitre"}
            className="book-progress"
          >
            {SPREADS.map((item, index) => (
              <button
                aria-current={index === spreadIndex ? "step" : undefined}
                aria-label={
                  revision
                    ? `Open chapter ${index + 1}: ${item.english.chapter}`
                    : `Ouvrir le chapitre ${index + 1} : ${item.chapter}`
                }
                className={`book-progress__dot ${index === spreadIndex ? "book-progress__dot--active" : ""}`}
                key={item.chapter}
                onClick={() => {
                  if (index === spreadIndex || turnDirection) return;
                  turnPage(index > spreadIndex ? "next" : "previous");
                  if (Math.abs(index - spreadIndex) > 1) {
                    timers.current.push(
                      window.setTimeout(() => setSpreadIndex(index), 300),
                    );
                  }
                }}
                type="button"
              />
            ))}
          </div>
          <div className="book-controls__buttons">
            <button
              aria-label={revision ? "Previous chapter" : "Chapitre précédent"}
              className="book-arrow"
              disabled={spreadIndex === 0 || turnDirection !== null}
              onClick={() => turnPage("previous")}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-label={revision ? "Next chapter" : "Chapitre suivant"}
              className="book-arrow"
              disabled={spreadIndex === SPREADS.length - 1 || turnDirection !== null}
              onClick={() => turnPage("next")}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <p className="book-reader__hint">
          <span aria-hidden="true">←</span>{" "}
          {revision
            ? "USE THE ARROW KEYS TO TURN PAGES"
            : "UTILISEZ LES FLÈCHES POUR FEUILLETER"}
        </p>
      </section>

      <footer className="book-footer">
        <span>{revision ? "A BOOK THAT CONNECTS THE DOTS." : "UN LIVRE POUR VOIR LES LIENS."}</span>
        <span>
          {revision ? "MIKBOOK — PRESENTATION PROTOTYPE" : "MIKBOOK — PROTOTYPE DE PRÉSENTATION"}
        </span>
      </footer>
    </main>
  );
}
