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
};

export const STORAGE_KEY = "mikbook-landing-layout-v2";

export const DEFAULT_WIDTHS: ColumnWidths = {
  col1: "22%",
  col2: "39%",
  col3: "39%",
};
