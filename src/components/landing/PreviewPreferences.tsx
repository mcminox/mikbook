"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type PreviewTheme = "paper" | "blue" | "sage" | "lavender";
export type ColorVisionSupport =
  | "standard"
  | "red-green"
  | "blue-yellow"
  | "high-contrast";

export type PreviewPreferences = {
  smoothScroll: boolean;
  theme: PreviewTheme;
  colorVision: ColorVisionSupport;
};

type PreviewPreferencesContextValue = {
  preferences: PreviewPreferences;
  updatePreferences: (patch: Partial<PreviewPreferences>) => void;
};

const STORAGE_KEY = "mikbook-preview-preferences-v1";

const DEFAULT_PREFERENCES: PreviewPreferences = {
  smoothScroll: true,
  theme: "paper",
  colorVision: "standard",
};

let snapshot = DEFAULT_PREFERENCES;
let initialized = false;
const listeners = new Set<() => void>();

function loadPreferences(): PreviewPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return readPreferences(JSON.parse(raw)) ?? DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Could not load preview settings.", error);
  }
  return DEFAULT_PREFERENCES;
}

function getSnapshot() {
  if (!initialized) {
    snapshot = loadPreferences();
    initialized = true;
  }
  return snapshot;
}

function getServerSnapshot() {
  return DEFAULT_PREFERENCES;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    snapshot = loadPreferences();
    initialized = true;
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function persistPreferences(preferences: PreviewPreferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Could not save preview settings.", error);
  }
}

const defaultContextValue: PreviewPreferencesContextValue = {
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: () => {},
};

const PreviewPreferencesContext =
  createContext<PreviewPreferencesContextValue>(defaultContextValue);

export function isPreviewTheme(value: string): value is PreviewTheme {
  return ["paper", "blue", "sage", "lavender"].includes(value);
}

export function isColorVisionSupport(
  value: string,
): value is ColorVisionSupport {
  return ["standard", "red-green", "blue-yellow", "high-contrast"].includes(
    value,
  );
}

function readPreferences(value: unknown): PreviewPreferences | null {
  if (!value || typeof value !== "object") return null;

  const saved = value as Record<string, unknown>;
  return {
    smoothScroll:
      typeof saved.smoothScroll === "boolean"
        ? saved.smoothScroll
        : DEFAULT_PREFERENCES.smoothScroll,
    theme:
      typeof saved.theme === "string" && isPreviewTheme(saved.theme)
        ? saved.theme
        : DEFAULT_PREFERENCES.theme,
    colorVision:
      typeof saved.colorVision === "string" &&
      isColorVisionSupport(saved.colorVision)
        ? saved.colorVision
        : DEFAULT_PREFERENCES.colorVision,
  };
}

export function PreviewPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const preferences = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const updatePreferences = useCallback(
    (patch: Partial<PreviewPreferences>) => {
      const next = { ...getSnapshot(), ...patch };
      snapshot = next;
      initialized = true;
      persistPreferences(next);
      listeners.forEach((listener) => listener());
    },
    [],
  );

  return (
    <PreviewPreferencesContext.Provider
      value={{ preferences, updatePreferences }}
    >
      <div
        className="preview-preferences"
        data-color-vision={preferences.colorVision}
        data-preview-theme={preferences.theme}
      >
        {children}
      </div>
    </PreviewPreferencesContext.Provider>
  );
}

export function usePreviewPreferences() {
  return useContext(PreviewPreferencesContext);
}
