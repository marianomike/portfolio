"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A Google Photos–style scrubber: a rail on the right edge with year labels at
// the scroll position where each stop begins (a chapter, labeled by its start
// year; the bubble shows the stop's data-label, e.g. its range). Dragging
// anywhere on the rail scrubs the page; plain scrolling moves the thumb. Every [data-year] element on
// the page is a stop, so the rail follows whatever the timeline renders.

type Stop = { year: number; label: string; top: number; frac: number };

const LABEL_GAP = 18; // px between visible labels; closer ones are dropped, as in Photos
const IDLE_MS = 1200;

export default function YearScrubber() {
  const railRef = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [railHeight, setRailHeight] = useState(0);
  const [frac, setFrac] = useState(0);
  const [year, setYear] = useState<number>();
  const [awake, setAwake] = useState(false);
  const [dragging, setDragging] = useState(false);
  const idle = useRef<number>(undefined);
  // While a finger is on the rail it owns the thumb: page height and rail box
  // are frozen at touch-down (Safari's toolbar resizes the page mid-drag), and
  // scrolling is coalesced to one scrollTo per frame. Deriving the thumb back
  // from scroll events during a drag is what made it flicker on iOS.
  const drag = useRef<{ max: number; rect: DOMRect } | null>(null);
  const frame = useRef(0);
  const pendingTop = useRef(0);

  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  const measure = useCallback(() => {
    if (drag.current) return;
    const max = maxScroll();
    // A year counts as reached once its heading clears the sticky controls.
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--controls-h")) + 16 || 120;
    const next = [...document.querySelectorAll<HTMLElement>("[data-year]")].map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      return { year: Number(el.dataset.year), label: el.dataset.label ?? el.dataset.year!, top, frac: Math.min(1, Math.max(0, top / max)) };
    });
    setStops(next);
    setRailHeight(railRef.current?.clientHeight ?? 0);
  }, []);

  const yearAt = useCallback(
    (scrollTop: number) => {
      let found = stops[0]?.year;
      for (const s of stops) if (s.top <= scrollTop + 1) found = s.year;
      return found;
    },
    [stops],
  );

  const wake = useCallback(() => {
    setAwake(true);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setAwake(false), IDLE_MS);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    const onScroll = () => {
      if (drag.current) return;
      setFrac(window.scrollY / maxScroll());
      setYear(yearAt(window.scrollY));
      wake();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [yearAt, wake]);

  const scrubTo = (clientY: number) => {
    const { max, rect } = drag.current!;
    const f = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    setFrac(f);
    setYear(yearAt(f * max));
    pendingTop.current = f * max;
    if (!frame.current) {
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        window.scrollTo(0, pendingTop.current);
      });
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { max: maxScroll(), rect: railRef.current!.getBoundingClientRect() };
    setDragging(true);
    scrubTo(e.clientY);
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    wake();
    measure();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = stops.findIndex((s) => s.year === year);
    const step = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const target = stops[Math.min(stops.length - 1, Math.max(0, i + step))];
    if (target) window.scrollTo({ top: target.top + 1, behavior: "smooth" });
  };

  // Drop labels that would collide with the one above, keeping the newest year.
  const labels: Stop[] = [];
  for (const s of stops) {
    const prev = labels.at(-1);
    if (!prev || (s.frac - prev.frac) * railHeight >= LABEL_GAP) labels.push(s);
  }

  const years = stops.map((s) => s.year);
  return (
    <div
      ref={railRef}
      className={`scrubber${awake || dragging ? " awake" : ""}${dragging ? " dragging" : ""}`}
      role="slider"
      tabIndex={0}
      aria-label="Scrub through the years"
      aria-orientation="vertical"
      aria-valuemin={years.length ? Math.min(...years) : undefined}
      aria-valuemax={years.length ? Math.max(...years) : undefined}
      aria-valuenow={year}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => drag.current && scrubTo(e.clientY)}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      {labels.map((s) => (
        <span key={s.year} className="scrubber-label" style={{ top: s.frac * railHeight }} aria-hidden>
          {s.year}
        </span>
      ))}
      <span className="scrubber-thumb" style={{ top: frac * railHeight }} aria-hidden>
        <span className="scrubber-bubble">{stops.find((s) => s.year === year)?.label}</span>
      </span>
    </div>
  );
}
