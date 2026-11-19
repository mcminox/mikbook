"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { ImageItem } from "@/lib/landing/layout-types";
import { clampImageInColumn } from "@/lib/landing/stack";

type Props = {
  image: ImageItem;
  editMode: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<ImageItem>) => void;
};

function getColumnMetrics(target: HTMLElement) {
  const col = target.closest<HTMLElement>("[data-image-column]");
  const colWidth = Math.max(1, col?.clientWidth ?? 1);
  const visualWidth = col?.getBoundingClientRect().width ?? colWidth;
  return {
    colWidth,
    columnScale: visualWidth / colWidth || 1,
  };
}

export function ImageLayer({ image, editMode, selected, onSelect, onChange }: Props) {
  const [cropMode, setCropMode] = useState(false);
  const [cropSelection, setCropSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [cropDragging, setCropDragging] = useState(false);
  const cropStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const startCrop = (event: Event) => {
      const custom = event as CustomEvent<{ id: string }>;
      if (custom.detail?.id === image.id) {
        setCropMode(true);
        setCropSelection(null);
        onSelect(image.id);
      }
    };
    window.addEventListener("mikbook:start-crop", startCrop);
    return () => window.removeEventListener("mikbook:start-crop", startCrop);
  }, [image.id, onSelect]);

  const cropPoint = useCallback((event: ReactPointerEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  const applyCrop = useCallback(async () => {
    if (!cropSelection || cropSelection.w < 2 || cropSelection.h < 2) return;
    const source = new Image();
    source.crossOrigin = "anonymous";
    source.onload = () => {
      const sx = Math.round((cropSelection.x / 100) * source.naturalWidth);
      const sy = Math.round((cropSelection.y / 100) * source.naturalHeight);
      const sw = Math.round((cropSelection.w / 100) * source.naturalWidth);
      const sh = Math.round((cropSelection.h / 100) * source.naturalHeight);
      if (sw < 2 || sh < 2) return;
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result !== "string") return;
            onChange(image.id, {
              src: reader.result,
              crop: undefined,
              naturalAspect: sh / sw,
            });
            setCropMode(false);
            setCropSelection(null);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.92,
      );
    };
    source.onerror = () => {
      window.alert("Не удалось загрузить изображение для точной обрезки.");
    };
    source.src = image.src;
  }, [cropSelection, image.id, image.src, onChange]);

  const dragRef = useRef<{
    mode: "move" | "scale";
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origScale: number;
    colWidth: number;
    columnScale: number;
  } | null>(null);

  const onPointerDownMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect(image.id);
      if (e.ctrlKey || e.metaKey) {
        const point = cropPoint(e);
        cropStartRef.current = point;
        setCropMode(true);
        setCropSelection({ x: point.x, y: point.y, w: 0, h: 0 });
        setCropDragging(true);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
      const { colWidth, columnScale } = getColumnMetrics(e.currentTarget as HTMLElement);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        mode: "move",
        startX: e.clientX,
        startY: e.clientY,
        origX: image.x,
        origY: image.y,
        origScale: image.scale,
        colWidth,
        columnScale,
      };
    },
    [cropPoint, editMode, image.id, image.scale, image.x, image.y, onSelect],
  );

  const onPointerDownScale = useCallback(
    (e: ReactPointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      onSelect(image.id);
      const { colWidth, columnScale } = getColumnMetrics(e.currentTarget as HTMLElement);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        mode: "scale",
        startX: e.clientX,
        startY: e.clientY,
        origX: image.x,
        origY: image.y,
        origScale: image.scale,
        colWidth,
        columnScale,
      };
    },
    [editMode, image.id, image.scale, image.x, image.y, onSelect],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (cropDragging && cropStartRef.current) {
        const end = cropPoint(e);
        const start = cropStartRef.current;
        setCropSelection({
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          w: Math.abs(end.x - start.x),
          h: Math.abs(end.y - start.y),
        });
        return;
      }
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (drag.mode === "move") {
        const nextX =
          drag.origX + ((dx / drag.columnScale) / drag.colWidth) * 100;
        const clamped = clampImageInColumn(
          { x: nextX, width: image.width, scale: image.scale },
          "x",
        );
        onChange(image.id, {
          x: clamped.x,
          y: Math.round(drag.origY + dy / drag.columnScale),
        });
      } else {
        const delta = dx / drag.columnScale / 120;
        const nextScale = drag.origScale + delta;
        const clamped = clampImageInColumn(
          { x: image.x, width: image.width, scale: nextScale },
          "scale",
        );
        onChange(image.id, { scale: clamped.scale, x: clamped.x });
      }
    },
    [cropDragging, cropPoint, image.id, image.scale, image.width, image.x, onChange],
  );

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    if (cropDragging) {
      setCropDragging(false);
      cropStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      return;
    }
    if (dragRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
      }
      dragRef.current = null;
    }
  }, [cropDragging]);

  const style: CSSProperties = {
    left: `${image.x}%`,
    top: image.y,
    width: `${image.width}%`,
    transform: `scale(${image.scale})`,
    transformOrigin: "top left",
    zIndex: image.zIndex,
    ...(image.crop
      ? {
          aspectRatio: String(image.crop.aspect),
          overflow: "hidden",
        }
      : {}),
  };

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (!el.naturalWidth) return;
    const aspect = el.naturalHeight / el.naturalWidth;
    if (
      !image.naturalAspect ||
      Math.abs(image.naturalAspect - aspect) > 0.01
    ) {
      onChange(image.id, { naturalAspect: aspect });
    }
  };

  const img = (
    <img
      src={image.src}
      alt=""
      draggable={false}
      className={`block w-full select-none ${image.crop ? "h-full object-cover" : "h-auto"}`}
      style={
        image.crop
          ? {
              objectPosition: `${image.crop.x}% ${image.crop.y}%`,
              transform: `scale(${image.crop.zoom})`,
            }
          : undefined
      }
      onLoad={onImgLoad}
    />
  );

  if (!editMode) {
    if (image.href) {
      return (
        <a
          href={image.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute block"
          style={style}
        >
          {img}
        </a>
      );
    }
    return (
      <div className="absolute" style={style}>
        {img}
      </div>
    );
  }

  return (
    <div
      className={`absolute cursor-move touch-none ${selected ? "ring-2 ring-black ring-offset-2" : "ring-1 ring-black/30"}`}
      style={style}
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(image.id);
      }}
    >
      {img}
      {cropMode && (
        <>
          {cropSelection && cropSelection.w > 0 && cropSelection.h > 0 && (
            <div
              className="pointer-events-none absolute border-2 border-white bg-black/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
              style={{
                left: `${cropSelection.x}%`,
                top: `${cropSelection.y}%`,
                width: `${cropSelection.w}%`,
                height: `${cropSelection.h}%`,
              }}
            />
          )}
          <div
            className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-1 rounded bg-black px-1 py-1 text-[10px] text-white"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="rounded px-2 py-1" onClick={applyCrop}>
              Вырезать
            </button>
            <button
              type="button"
              className="rounded border border-white/30 px-2 py-1"
              onClick={() => {
                setCropMode(false);
                setCropSelection(null);
              }}
            >
              Отмена
            </button>
          </div>
        </>
      )}
      {selected && !cropMode && (
        <button
          type="button"
          aria-label="Scale"
          className="absolute -right-2 -bottom-2 h-4 w-4 cursor-nwse-resize rounded-full border border-black bg-white"
          onPointerDown={onPointerDownScale}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      )}
    </div>
  );
}
