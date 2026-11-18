"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLandingLayout } from "@/lib/landing/useLandingLayout";
import { ColumnLayout } from "./ColumnLayout";
import { ImageEditorPanel } from "./ImageEditorPanel";
import { SubscribeWidget } from "./SubscribeWidget";

const PREVIEW_STORAGE_KEY = "mikbook-landing-layout-preview-v1";

export function LandingShell({ revision = false }: { revision?: boolean }) {
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const {
    layout,
    ready,
    dirty,
    updateLayout,
    updateImage,
    addImage,
    removeImage,
    save,
    reset,
    exportJson,
    setColumnWidth,
  } = useLandingLayout(
    revision ? PREVIEW_STORAGE_KEY : undefined,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorZoom, setEditorZoom] = useState(0.9);

  if (!ready || !layout) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--landing-bg)] text-sm text-black/50">
        Loading…
      </div>
    );
  }

  return (
    <>
      <ColumnLayout
        layout={layout}
        editorZoom={editorZoom}
        revision={revision}
        editMode={editMode}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onChange={updateImage}
        onColumnWidth={setColumnWidth}
      />
      {editMode && (
        <ImageEditorPanel
          layout={layout}
          selectedId={selectedId}
          zoom={editorZoom}
          english={revision}
          dirty={dirty}
          onSelect={setSelectedId}
          onChange={updateImage}
          onAdd={(column) => {
            const id = addImage(column);
            setSelectedId(id);
          }}
          onRemove={removeImage}
          onSave={save}
          onReset={reset}
          onExport={exportJson}
          onWidthsChange={(columnWidths) =>
            updateLayout((prev) => ({ ...prev, columnWidths }))
          }
          onZoomChange={setEditorZoom}
        />
      )}
      {!editMode && <SubscribeWidget demoMode={revision} />}
    </>
  );
}
