"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  isColorVisionSupport,
  isPreviewTheme,
  usePreviewPreferences,
} from "./PreviewPreferences";

type Props = {
  menuHref: string;
  onMenuClick?: () => void;
};

export function RevisionHeader({ menuHref, onMenuClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { preferences, updatePreferences } = usePreviewPreferences();

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !actionsRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="revision-header">
      <Link aria-label="MIKBOOK, home" className="revision-header__brand" href="/preview">
        MIKBOOK
      </Link>
      <div className="revision-header__actions" ref={actionsRef}>
        <button
          aria-expanded={menuOpen}
          aria-controls="preview-settings-panel"
          aria-label="Preview settings"
          className="revision-header__menu"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          MENU <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        {menuOpen && (
          <section
            aria-label="Preview settings"
            className="revision-header__panel"
            id="preview-settings-panel"
          >
            <div className="revision-header__panel-top">
              <strong>Preview settings</strong>
              <Link href={menuHref} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </div>
            {onMenuClick && (
              <button
                className="revision-header__chapters"
                onClick={() => {
                  onMenuClick();
                  setMenuOpen(false);
                }}
                type="button"
              >
                Go to chapter index
              </button>
            )}
            <label className="revision-header__setting revision-header__setting--toggle">
              <span>
                <strong>Smooth scrolling</strong>
                <small>Ease mouse-wheel movement on desktop.</small>
              </span>
              <input
                checked={preferences.smoothScroll}
                onChange={(event) =>
                  updatePreferences({ smoothScroll: event.currentTarget.checked })
                }
                type="checkbox"
              />
            </label>
            <label className="revision-header__setting">
              <span>Colour theme</span>
              <select
                onChange={(event) => {
                  const theme = event.currentTarget.value;
                  if (isPreviewTheme(theme)) updatePreferences({ theme });
                }}
                value={preferences.theme}
              >
                <option value="paper">Warm paper</option>
                <option value="blue">Cool blue</option>
                <option value="sage">Soft sage</option>
                <option value="lavender">Soft lavender</option>
              </select>
            </label>
            <label className="revision-header__setting">
              <span>Colour vision support</span>
              <select
                onChange={(event) => {
                  const colorVision = event.currentTarget.value;
                  if (isColorVisionSupport(colorVision)) {
                    updatePreferences({ colorVision });
                  }
                }}
                value={preferences.colorVision}
              >
                <option value="standard">Standard</option>
                <option value="red-green">Red–green difficulty</option>
                <option value="blue-yellow">Blue–yellow difficulty</option>
                <option value="high-contrast">High contrast</option>
              </select>
            </label>
            <p className="revision-header__note">
              Colour support adjusts interface accents; embedded image colours stay unchanged.
            </p>
          </section>
        )}
      </div>
    </header>
  );
}
