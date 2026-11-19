"use client";

import type { ImageItem, LandingLayout } from "@/lib/landing/layout-types";

type Props = {
  layout: LandingLayout;
  selectedId: string | null;
  zoom: number;
  english?: boolean;
  dirty: boolean;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<ImageItem>) => void;
  onAdd: (column: 2 | 3) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onZoomChange: (zoom: number) => void;
  onWidthsChange: (widths: LandingLayout["columnWidths"]) => void;
};

export function ImageEditorPanel({
  layout,
  selectedId,
  zoom,
  english = false,
  dirty,
  onSelect,
  onChange,
  onAdd,
  onRemove,
  onSave,
  onReset,
  onExport,
  onZoomChange,
  onWidthsChange,
}: Props) {
  const selected = layout.images.find((i) => i.id === selectedId) ?? null;
  const crop = selected?.crop ?? null;

  return (
    <aside className="image-editor-panel fixed top-3 right-3 z-[100] flex max-h-[calc(100dvh-1.5rem)] w-72 flex-col gap-3 overflow-y-auto rounded-lg border border-black/15 bg-white/95 p-3 text-xs text-black shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <strong className="text-sm">Image editor</strong>
        {dirty && <span className="text-amber-700">unsaved</span>}
      </div>
      <p className="text-[10px] text-black/50">
        Preview edits are saved in this browser only.
      </p>

      <section className="space-y-2 border-b border-black/10 pb-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Canvas</p>
          <span className="tabular-nums text-black/55">{Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Zoom out"
            className="h-7 w-7 rounded border border-black/15 text-base leading-none"
            disabled={zoom <= 0.5}
            onClick={() => onZoomChange(Math.max(0.5, Math.round((zoom - 0.1) * 100) / 100))}
            type="button"
          >
            −
          </button>
          <input
            aria-label="Canvas zoom"
            className="min-w-0 flex-1 accent-black"
            max="130"
            min="50"
            onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
            step="5"
            type="range"
            value={Math.round(zoom * 100)}
          />
          <button
            aria-label="Zoom in"
            className="h-7 w-7 rounded border border-black/15 text-base leading-none"
            disabled={zoom >= 1.3}
            onClick={() => onZoomChange(Math.min(1.3, Math.round((zoom + 0.1) * 100) / 100))}
            type="button"
          >
            +
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-black/50">Scroll to pan · drag images to arrange</p>
          <button
            className="shrink-0 rounded border border-black/15 px-2 py-1 text-[10px]"
            onClick={() => onZoomChange(0.9)}
            type="button"
          >
            Fit
          </button>
        </div>
      </section>

      <section className="space-y-1.5 border-b border-black/10 pb-3">
        <p className="font-medium">Column widths</p>
        {(["col1", "col2", "col3"] as const).map((key) => (
          <label key={key} className="flex items-center justify-between gap-2">
            <span>{key}</span>
            <input
              className="w-24 rounded border border-black/20 px-1.5 py-1"
              value={layout.columnWidths[key]}
              onChange={(e) =>
                onWidthsChange({ ...layout.columnWidths, [key]: e.target.value })
              }
            />
          </label>
        ))}
        <p className="text-[10px] text-black/50">e.g. 22% — applied live via CSS vars</p>
      </section>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          className="rounded bg-black px-2 py-1.5 text-white"
          onClick={onSave}
        >
          Save
        </button>
        <button
          type="button"
          className="rounded border border-black/20 px-2 py-1.5"
          onClick={onExport}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="rounded border border-black/20 px-2 py-1.5"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          className="flex-1 rounded border border-black/20 px-2 py-1.5"
          onClick={() => onAdd(2)}
        >
          + Col 2
        </button>
        <button
          type="button"
          className="flex-1 rounded border border-black/20 px-2 py-1.5"
          onClick={() => onAdd(3)}
        >
          + Col 3
        </button>
      </div>

      <ul className="max-h-40 space-y-1 overflow-y-auto border-b border-black/10 pb-3">
        {layout.images.map((img) => (
          <li key={img.id}>
            <button
              type="button"
              className={`w-full rounded px-2 py-1 text-left ${selectedId === img.id ? "bg-black text-white" : "hover:bg-black/5"}`}
              onClick={() => onSelect(img.id)}
            >
              col{img.column} · {img.id}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <section className="space-y-2">
          <p className="font-medium">Selected: {selected.id}</p>

          <label className="block space-y-1">
            <span>Replace image</span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-[10px]"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    onChange(selected.id, { src: reader.result });
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>

          <button
            type="button"
            className="w-full rounded border border-black/20 px-2 py-1.5"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("mikbook:start-crop", { detail: { id: selected.id } }),
              )
            }
          >
            Crop image (Ctrl / Cmd + drag)
          </button>

          <label className="block space-y-1">
            <span>Link (href)</span>
            <input
              className="w-full rounded border border-black/20 px-1.5 py-1"
              value={selected.href ?? ""}
              placeholder="https://…"
              onChange={(e) =>
                onChange(selected.id, {
                  href: e.target.value.trim() || undefined,
                })
              }
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            <span>X %</span>
            <input
              type="number"
              className="w-20 rounded border border-black/20 px-1.5 py-1"
              value={selected.x}
              onChange={(e) => onChange(selected.id, { x: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Y px</span>
            <input
              type="number"
              className="w-20 rounded border border-black/20 px-1.5 py-1"
              value={selected.y}
              onChange={(e) => onChange(selected.id, { y: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Width %</span>
            <input
              type="number"
              className="w-20 rounded border border-black/20 px-1.5 py-1"
              value={selected.width}
              onChange={(e) => onChange(selected.id, { width: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Scale</span>
            <input
              type="number"
              step="0.05"
              className="w-20 rounded border border-black/20 px-1.5 py-1"
              value={selected.scale}
              onChange={(e) => onChange(selected.id, { scale: Number(e.target.value) })}
            />
          </label>
          <label className="block space-y-1">
            <span>Crop shape</span>
            <select
              className="w-full rounded border border-black/20 px-1.5 py-1"
              value={selected.crop?.aspect ?? ""}
              onChange={(e) => {
                const aspect = Number(e.target.value);
                onChange(selected.id, {
                  crop:
                    aspect > 0
                      ? {
                          aspect,
                          x: selected.crop?.x ?? 50,
                          y: selected.crop?.y ?? 50,
                          zoom: selected.crop?.zoom ?? 1,
                        }
                      : undefined,
                });
              }}
            >
              <option value="">Original proportions</option>
              <option value="1">Square</option>
              <option value="1.5">Landscape 3:2</option>
              <option value="1.7778">Wide 16:9</option>
              <option value="0.6667">Portrait 2:3</option>
            </select>
          </label>
          {crop && (
            <>
              <label className="block space-y-1">
                <span>Crop horizontal position</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  value={crop.x}
                  onChange={(e) =>
                    onChange(selected.id, {
                      crop: { ...crop, x: Number(e.target.value) },
                    })
                  }
                />
              </label>
              <label className="block space-y-1">
                <span>Crop vertical position</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  value={crop.y}
                  onChange={(e) =>
                    onChange(selected.id, {
                      crop: { ...crop, y: Number(e.target.value) },
                    })
                  }
                />
              </label>
              <label className="block space-y-1">
                <span>Crop zoom</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  className="w-full"
                  value={crop.zoom}
                  onChange={(e) =>
                    onChange(selected.id, {
                      crop: { ...crop, zoom: Number(e.target.value) },
                    })
                  }
                />
              </label>
            </>
          )}
          <label className="flex items-center justify-between gap-2">
            <span>zIndex</span>
            <input
              type="number"
              className="w-20 rounded border border-black/20 px-1.5 py-1"
              value={selected.zIndex}
              onChange={(e) => onChange(selected.id, { zIndex: Number(e.target.value) })}
            />
          </label>

          <button
            type="button"
            className="w-full rounded border border-red-300 px-2 py-1.5 text-red-700"
            onClick={() => {
              onRemove(selected.id);
              onSelect(null);
            }}
          >
            Delete image
          </button>
        </section>
      )}

      <p className="text-[10px] text-black/45">
        {english
          ? "Stack layout: scaling moves lower images down. Drag horizontally to reposition; drag vertically to change the order."
          : "Стопка: scale сдвигает все ниже. Drag X — смещение, Y — порядок в колонке."}
      </p>
    </aside>
  );
}
