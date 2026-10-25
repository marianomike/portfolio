"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A Google Photos–style scrubber: a rail on the right edge with year labels at
// the scroll position where each year begins. Dragging anywhere on the rail
// scrubs the page; plain scrolling moves the thumb. Every [data-year] element on
// the page is a stop, so the rail follows whatever the timeline renders.

type Stop = { year: number; top: number; frac: number };

const LABEL_GAP = 18; // px between visible labels; closer ones are dropped, as in Photos
const IDLE_MS = 1200;

export default function YearScrubber({ onYear }: { onYear?: (year: number) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [railHeight, setRailHeight] = useState(0);
  const [frac, setFrac] = useState(0);
  const [year, setYear] = useState<number>();
  const [awake, setAwake] = useState(false);
  const [dragging, setDragging] = useState(false);
  const idle = useRef<number>(undefined);

  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  const measure = useCallback(() => {
    const max = maxScroll();
    // A year counts as reached once its heading clears the sticky controls.
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--controls-h")) + 16 || 120;
    const next = [...document.querySelectorAll<HTMLElement>("[data-year]")].map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      return { year: Number(el.dataset.year), top, frac: Math.min(1, Math.max(0, top / max)) };
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
      setFrac(window.scrollY / maxScroll());
      setYear(yearAt(window.scrollY));
      wake();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [yearAt, wake]);

  useEffect(() => {
    if (year !== undefined) onYear?.(year);
  }, [year, onYear]);

  const scrubTo = (clientY: number) => {
    const rect = railRef.current!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    window.scrollTo({ top: f * maxScroll(), behavior: "instant" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    scrubTo(e.clientY);
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
      onPointerMove={(e) => dragging && scrubTo(e.clientY)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={onKeyDown}
    >
      {labels.map((s) => (
        <span key={s.year} className="scrubber-label" style={{ top: s.frac * railHeight }} aria-hidden>
          {s.year}
        </span>
      ))}
      <span className="scrubber-thumb" style={{ top: frac * railHeight }} aria-hidden>
        <span className="scrubber-bubble">{year}</span>
      </span>
    </div>
  );
}
