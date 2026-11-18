"use client";

import { useEffect, useRef } from "react";

export function useSmoothWheelScroll<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    let frame: number | null = null;
    let targetScrollTop: number | null = null;

    const animate = () => {
      if (targetScrollTop === null) {
        frame = null;
        return;
      }

      const distance = targetScrollTop - element.scrollTop;
      if (Math.abs(distance) < 1) {
        element.scrollTop = targetScrollTop;
        targetScrollTop = null;
        frame = null;
        return;
      }

      element.scrollTop += distance * 0.18;
      frame = window.requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }

      const maxScrollTop = element.scrollHeight - element.clientHeight;
      if (maxScrollTop <= 0) return;

      let delta = event.deltaY;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 16;
      } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= element.clientHeight;
      }

      const currentTarget = targetScrollTop ?? element.scrollTop;
      const nextTarget = Math.min(
        maxScrollTop,
        Math.max(0, currentTarget + delta * 0.85),
      );
      if (nextTarget === currentTarget) return;

      event.preventDefault();
      targetScrollTop = nextTarget;
      if (frame === null) frame = window.requestAnimationFrame(animate);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return ref;
}
