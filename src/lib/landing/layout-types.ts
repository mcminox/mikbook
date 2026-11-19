export type ColumnId = 2 | 3;

export type ImageCrop = {
  aspect: number;
  x: number;
  y: number;
  zoom: number;
};

export type ImageItem = {
  id: string;
  column: ColumnId;
  src: string;
  x: number;
  y: number;
  order: number;
  scale: number;
  width: number;
  href?: string;
  zIndex: number;
  crop?: ImageCrop;
  naturalAspect?: number;
};

export type ColumnWidths = {
  col1: string;
  col2: string;
  col3: string;
};

export type LandingLayout = {
  version: 1;
  columnWidths: ColumnWidths;
  images: ImageItem[];
  contentHeight: number;
  text?: LandingText;
};

export const DEFAULT_LANDING_TEXT: LandingText = {
  brand: "MIKBOOK",
  intro:
    "Devenir un interne sous-alimenté puis un médecin assigné en justice n'est pas facile ; il faut d'abord une dure préparation.",
  description:
    "Synthèse méthodique du programme des EDN, le MIKBOOK propose aux étudiants un outil de mémorisation visuelle et logique des points essentiels, s'appuyant sur un graphisme particulier et un code de couleurs identique pour chaque item de chaque chapitre, visant à un projet pédagogique global.",
  cta: "Lire le Mikbook",
  ctaNote: "ou simplement jouer avec.",
  contact: "@mikbook\nEditions Eyrolles\n1 rue Thénard\n75005 Paris",
  secretTitle: "La grotte secrète",
  pavilionTitle: "Pavillon aquatique",
};

export const ORIGINAL_LANDING_TEXT: LandingText = {
  brand: "MIKBOOK",
  intro:
    "Devenir un interne sous-alimenté puis un médecin assigné en justice n'est pas facile ; il faut d'abord une dure préparation.",
  description:
    "Synthèse méthodique du programme des EDN, le MIKBOOK propose aux étudiants un outil de mémorisation visuelle et logique des points essentiels, s'appuyant sur un graphisme particulier et un code de couleurs identique pour chaque item de chaque chapitre, visant à un projet pédagogique global.",
  cta: "Read the Mikbook",
  ctaNote: "or just play with it.",
  contact: "@mikbook\nEditions Eyrolles\n1 rue Thénard\n75005 Paris",
  secretTitle: "The Secret Cave",
  pavilionTitle: "Water Pavillion",
};

export type LandingText = {
  brand: string;
  intro: string;
  description: string;
  cta: string;
  ctaNote: string;
  contact: string;
  secretTitle: string;
  pavilionTitle: string;
};

export const STORAGE_KEY = "mikbook-landing-layout-v2";

export const DEFAULT_WIDTHS: ColumnWidths = {
  col1: "22%",
  col2: "39%",
  col3: "39%",
};
