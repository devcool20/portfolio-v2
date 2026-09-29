"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import styles from "./flight-button.module.css";

interface FlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Called as the plane launches, for side effects. Submission itself is
   *  still handled natively by `type="submit"`. */
  onFlight?: () => void;
  /** Externally driven label, used for the real success/failure state. */
  label?: string;
  busy?: boolean;
}

export function FlightButton({ className, onClick, onFlight, label = "Send Message", busy, ...props }: FlightButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isActive || props.disabled) return;

    if (onClick) onClick(e);

    // Reduced motion: report the action immediately, keep the button stable.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    setIsActive(true);

    const button = buttonRef.current;
    if (!button) return;

    onFlight?.();

    gsap.set(button, { "--plane-opacity": 1 });

    gsap.to(button, {
      keyframes: [
        {
          "--left-wing-first-x": 50,
          "--left-wing-first-y": 100,
          "--right-wing-second-x": 50,
          "--right-wing-second-y": 100,
          duration: 0.2,
          onComplete() {
            gsap.set(button, {
              "--left-wing-first-y": 0,
              "--left-wing-second-x": 40,
              "--left-wing-second-y": 100,
              "--left-wing-third-x": 0,
              "--left-wing-third-y": 100,
              "--left-body-third-x": 40,
              "--right-wing-first-x": 50,
              "--right-wing-first-y": 0,
              "--right-wing-second-x": 60,
              "--right-wing-second-y": 100,
              "--right-wing-third-x": 100,
              "--right-wing-third-y": 100,
              "--right-body-third-x": 60,
            });
          },
        },
        {
          "--left-wing-third-x": 20,
          "--left-wing-third-y": 90,
          "--left-wing-second-y": 90,
          "--left-body-third-y": 90,
          "--right-wing-third-x": 80,
          "--right-wing-third-y": 90,
          "--right-body-third-y": 90,
          "--right-wing-second-y": 90,
          duration: 0.2,
        },
        { "--rotate": 50, "--left-wing-third-y": 95, "--left-wing-third-x": 27, "--right-body-third-x": 45, "--right-wing-second-x": 45, "--right-wing-third-x": 60, "--right-wing-third-y": 83, duration: 0.25 },
        { "--rotate": 60, "--plane-x": -8, "--plane-y": 40, duration: 0.2 },
        {
          "--rotate": 40,
          "--plane-x": 45,
          "--plane-y": -300,
          "--plane-opacity": 0,
          duration: 0.375,
        },
      ],
    });

    gsap.to(button, {
      keyframes: [
        { "--text-opacity": 0, "--border-radius": 0, duration: 0.11 },
        { duration: 0.14 },
        { duration: 0.25, delay: 0.1 },
        { "--trails-stroke": 171, duration: 0.22, delay: 0.22 },
        { "--success-opacity": 1, "--success-x": 0, duration: 0.2, delay: 0.15 },
        { "--success-stroke": 0, duration: 0.15 },
      ],
      onComplete() {
        setTimeout(() => {
          if (!buttonRef.current) return;
          buttonRef.current.removeAttribute("style");
          gsap.fromTo(
            buttonRef.current,
            { opacity: 0, y: -8 },
            {
              opacity: 1,
              y: 0,
              clearProps: true,
              duration: 0.3,
              onComplete() {
                setIsActive(false);
              },
            },
          );
        }, 1800);
      },
    });
  };

  return (
    <button
      ref={buttonRef}
      className={`${styles.button} ${className || ""}`}
      onClick={handleClick}
      aria-busy={busy || undefined}
      {...props}
    >
      <span className={styles.defaultText}>{busy ? "Sending…" : label}</span>
      <span className={styles.successText}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        Sent
      </span>
      <svg className={styles.trails} viewBox="0 0 33 64" aria-hidden>
        <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60" />
        <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60" />
      </svg>
      <div className={styles.plane} aria-hidden>
        <div className={styles.left} />
        <div className={styles.right} />
      </div>
    </button>
  );
}
