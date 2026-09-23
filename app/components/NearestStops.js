"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function NearestStops({
  children,
  peekHeight = 86,
  heightClass = "h-[70dvh]",
}) {
  const sheetRef = useRef(null);
  const contentRef = useRef(null);
  const drag = useRef(null);
  const openRef = useRef(false);
  const suppressClick = useRef(false);
  const api = useRef({});
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [dragY, setDragY] = useState(null); // px translateY while dragging, else null

  const applyOpen = (v) => {
    openRef.current = v;
    setOpen(v);
  };

  const closedY = () => (sheetRef.current?.offsetHeight ?? 0) - peekHeight;
  const clamp = (y) => Math.min(Math.max(y, 0), closedY());

  // --- shared drag logic (used by touch and mouse handlers) ---------------
  const begin = (y, target) => {
    const c = contentRef.current;
    const inContent = !!c && c.contains(target);
    drag.current = {
      startY: y,
      lastY: y,
      startTranslate: openRef.current ? 0 : closedY(),
      startTime: performance.now(),
      mode: null, // "sheet" = we move the sheet, "scroll" = let content scroll
      inContent,
      scrollTop: inContent ? c.scrollTop : 0,
    };
  };

  const move = (y, e) => {
    const d = drag.current;
    if (!d) return;
    d.lastY = y;
    const dy = y - d.startY;

    if (d.mode === null) {
      if (Math.abs(dy) < 4) return;
      if (!openRef.current || !d.inContent) d.mode = "sheet";
      else if (d.scrollTop <= 0 && dy > 0)
        d.mode = "sheet"; // pull down at top of content
      else d.mode = "scroll";
    }

    if (d.mode === "sheet") {
      if (e.cancelable) e.preventDefault(); // stop the page/content from scrolling
      setDragY(clamp(d.startTranslate + dy));
    }
  };

  const finish = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.mode !== "sheet") return;

    // A drag must not also count as a click on the header
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 50);

    const dy = d.lastY - d.startY;
    const velocity = dy / Math.max(performance.now() - d.startTime, 1); // px/ms
    const y = clamp(d.startTranslate + dy);

    applyOpen(
      Math.abs(velocity) > 0.5
        ? velocity < 0 // fast flick up = open, down = close
        : y < closedY() / 2, // otherwise snap to the nearer end
    );
    setDragY(null); // hand control back to the CSS transition
  };

  api.current = { begin, move, finish };

  // Render into <body> so no parent (transform, overflow, z-index) can trap it
  useEffect(() => setMounted(true), []);

  // Touch: native listeners so touchmove can be non-passive (needed for preventDefault)
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onStart = (e) => {
      if (e.touches.length === 1)
        api.current.begin(e.touches[0].clientY, e.target);
    };
    const onMove = (e) => {
      if (e.touches.length === 1) api.current.move(e.touches[0].clientY, e);
    };
    const onEnd = () => api.current.finish();
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [mounted]);

  // Mouse / pen: drag from anywhere on the sheet except the scrollable content
  const onPointerDown = (e) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    if (openRef.current && contentRef.current?.contains(e.target)) return;
    api.current.begin(e.clientY, e.target);
    const onMove = (ev) => api.current.move(ev.clientY, ev);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      api.current.finish();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const transform =
    dragY !== null
      ? `translateY(${dragY}px)`
      : open
        ? "translateY(0)"
        : `translateY(calc(100% - ${peekHeight}px))`;

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={() => applyOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-9998 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      <section
        ref={sheetRef}
        id="slide-up-sheet"
        onPointerDown={onPointerDown}
        style={{ transform }}
        className={`fixed mx-auto inset-x-0 bottom-0 z-9999 flex flex-col bg-white rounded-t-[2.5rem] lg:rounded-t-4xl will-change-transform motion-reduce:transition-none lg:w-2xl ${heightClass} ${
          dragY !== null
            ? "transition-none"
            : "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        } ${open ? "shadow-[0_-20px_90px_rgba(0,0,0,0.12)]" : "shadow-[0_-8px_32px_rgba(0,0,0,0.1)]"}`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="slide-up-sheet"
          onClick={() => {
            if (!suppressClick.current) applyOpen(!openRef.current);
          }}
          style={{ height: peekHeight, touchAction: "none" }}
          className="flex shrink-0 cursor-grab select-none flex-col items-center justify-center gap-3 active:cursor-grabbing"
        >
          <span className="h-1 w-8 rounded-full bg-neutral-300" />

          <div className="text-left w-full px-7">
            <p className="font-semibold text-sm">Nearby Bus Stops</p>
            <p className="text-sm text-grey">Find bus stops near you</p>
          </div>
        </button>

        <div
          ref={contentRef}
          className="flex-1 overflow-y-scroll overscroll-contain pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        >
          {children}
        </div>
      </section>
    </>,
    document.body,
  );
}
