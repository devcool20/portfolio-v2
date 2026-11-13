"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Hand, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./character/animated-character.module.css";

type Gesture = "idle" | "wave" | "peace" | "nod" | "celebrate" | "tilt";
const gestures: Gesture[] = ["wave", "peace", "nod", "celebrate", "tilt"];
const portraitSizes = "(min-width: 1280px) 208px, (min-width: 1100px) 176px, 76px";
const captions: Record<Gesture, string> = {
  idle: "", wave: "Hey, nice to meet you!", peace: "Good vibes only.",
  nod: "Let's build something.", celebrate: "Ship it!", tilt: "Got an interesting idea?",
};
const subscribe = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReducedMotion = () => true;

export default function AnimatedCharacter({ variant, className }: { variant: "desktop" | "compact"; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const next = useRef(0);
  const greeted = useRef(false);
  const [visible, setVisible] = useState(false);
  const [gesture, setGesture] = useState<Gesture>("idle");
  const [sequence, setSequence] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [readyPoses, setReadyPoses] = useState<string[]>([]);
  const [failedPoses, setFailedPoses] = useState<string[]>([]);
  const reduce = useSyncExternalStore(subscribe, getReducedMotion, getServerReducedMotion);

  const play = (choice?: Gesture) => {
    clearTimeout(timer.current);
    const selected = choice ?? gestures[next.current++ % gestures.length];
    setGesture(selected);
    setAnnouncement(captions[selected]);
    setSequence(value => value + 1);
    timer.current = setTimeout(() => setGesture("idle"), 2800);
  };
  const stop = () => { clearTimeout(timer.current); setGesture("idle"); setAnnouncement(""); };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Hidden mobile/desktop instances never run their idle animations.
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden && element.getBoundingClientRect().width > 0);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    const resize = new ResizeObserver(sync);
    observer.observe(element);
    resize.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); resize.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  // Decode the optimized poses before swapping them in; the first greeting
  // keeps its neutral portrait until the complete pose is ready.
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    for (const pose of ["wave", "peace"]) {
      const { props } = getImageProps({ src: `/character/${pose}-v3.png`, alt: "", width: 1254, height: 1254, sizes: portraitSizes });
      const image = new window.Image();
      image.sizes = portraitSizes;
      image.srcset = props.srcSet ?? "";
      image.src = props.src;
      void image.decode().then(() => {
        if (!cancelled) setReadyPoses(current => current.includes(pose) ? current : [...current, pose]);
      }, () => {});
    }
    return () => { cancelled = true; };
  }, [visible]);

  useEffect(() => {
    if (!visible || reduce) return;
    // Quiet pauses between small, varied movements. User gestures take priority.
    const interval = setInterval(() => {
      if (container.current?.matches(":hover, :focus-within")) return;
      const selected = gestures[next.current++ % gestures.length];
      setGesture(selected);
      setSequence(value => value + 1);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setGesture("idle"), 2800);
    }, 14000);
    return () => clearInterval(interval);
  }, [visible, reduce]);

  const pose = (gesture === "wave" || gesture === "peace") && readyPoses.includes(gesture) ? gesture : "portrait";
  const poseSource = `/character/${pose}-v3.png`;

  return (
    <div ref={container} className={cn(styles.character, styles[variant], className)} data-character={variant}
      data-active={visible && !reduce} data-gesture={gesture} onKeyDown={event => { if (event.key === "Escape") stop(); }}>
      <button type="button" className={styles.portraitButton} aria-label="Play Divyanshu's next gesture"
        onClick={() => play()} onPointerEnter={event => {
          if (event.pointerType === "mouse" && !greeted.current) { greeted.current = true; play("wave"); }
        }}>
        <span className={styles.crop}>
          <span className={styles.breathe}>
            <span key={sequence} className={styles.pose}>
              <Image src={failedPoses.includes(poseSource) ? "/character/portrait-v3.png" : poseSource} alt="Divyanshu, with swept black hair, a short beard and a black t-shirt"
                width={1254} height={1254} sizes={portraitSizes}
                loading="eager" className={cn(styles.portrait, pose === "wave" && !failedPoses.includes(poseSource) && styles.waveBody)} draggable={false}
                onError={() => setFailedPoses(current => current.includes(poseSource) ? current : [...current, poseSource])} />
              {pose === "wave" && !failedPoses.includes(poseSource) && (
                <Image src={poseSource} alt="" width={1254} height={1254}
                  sizes={portraitSizes}
                  className={styles.waveHand} draggable={false} />
              )}
            </span>
          </span>
        </span>
        <span className={styles.speech} aria-hidden="true">{captions[gesture]}</span>
        <span className={styles.sparkles} aria-hidden="true">✦ <span>✧</span> ✦</span>
      </button>
      <div className={styles.controls} aria-label="Portrait gestures">
        <button type="button" onClick={() => play("wave")} aria-label="Wave" aria-pressed={gesture === "wave"}><Hand size={14} /></button>
        <button type="button" onClick={() => play("peace")} aria-label="Peace sign" aria-pressed={gesture === "peace"}><span aria-hidden="true">✌</span></button>
        <button type="button" onClick={() => play()} aria-label="Try another gesture"><Shuffle size={14} /></button>
      </div>
      <span className={styles.hint}>Try a gesture</span>
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    </div>
  );
}
