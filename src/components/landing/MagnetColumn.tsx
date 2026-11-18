"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ColumnId, ImageItem } from "@/lib/landing/layout-types";
import { useSmoothWheelScroll } from "@/lib/landing/useSmoothWheelScroll";
import { sortByOrder, stackedHeight, STACK_GAP, STACK_START_Y } from "@/lib/landing/stack";
import { ImageLayer } from "./ImageLayer";

type Props = {
  column: ColumnId;
  images: ImageItem[];
  contentHeight: number;
  editMode: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<ImageItem>) => void;
  onColumnWidth: (column: ColumnId, widthPx: number) => void;
  smoothScroll?: boolean;
  header?: ReactNode;
  className?: string;
};

export function MagnetColumn({
  column,
  images,
  contentHeight,
  editMode,
  selectedId,
  onSelect,
  onChange,
  onColumnWidth,
  smoothScroll = false,
  header,
  className = "",
}: Props) {
  const ref = useSmoothWheelScroll<HTMLDivElement>(smoothScroll);
  const [columnWidth, setColumnWidth] = useState(400);
  const sorted = sortByOrder(images.filter((i) => i.column === column));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => {
      const width = el.clientWidth;
      if (width < 40) return;
      setColumnWidth(width);
      onColumnWidth(column, width);
    };
    const frame = window.requestAnimationFrame(report);
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => {
      window.cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [column, onColumnWidth, ref]);

  let stackBottom = STACK_START_Y[column];
  for (const img of sorted) {
    stackBottom +=
      stackedHeight(img, columnWidth, img.naturalAspect ?? 1.25) + STACK_GAP;
  }
  const minH = Math.max(contentHeight, Math.round(stackBottom + 80));

  return (
    <div
      ref={ref}
      className={className}
      data-image-column={column}
    >
      <div className="relative p-3 pb-12" style={{ minHeight: minH }}>
        {header}
        {sorted.map((img) => (
          <ImageLayer
            key={img.id}
            image={img}
            editMode={editMode}
            selected={selectedId === img.id}
            onSelect={onSelect}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
