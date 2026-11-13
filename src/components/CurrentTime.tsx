"use client";

import { useEffect, useState } from "react";

/** Changing seconds never move the other digits. */
export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setTime(new Date());
    const first = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => { window.clearTimeout(first); window.clearInterval(interval); };
  }, []);
  const value = time
    ? [time.getHours(), time.getMinutes(), time.getSeconds()].map(n => String(n).padStart(2, "0")).join(":")
    : "--:--:--";
  return (
    <div className="hero-time" role="timer" aria-live="off" aria-label={time ? `Your local time ${value}` : "Loading local time"}>
      <span className="hero-time-label" aria-hidden="true">Local time</span>
      <span className="hero-time-digits" aria-hidden="true">
        {Array.from(value).map((digit, index) => <span key={index}>{digit}</span>)}
      </span>
    </div>
  );
}
