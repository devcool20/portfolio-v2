"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { CHARACTER } from "@/components/character/character-config";
import styles from "./character/animated-character.module.css";

type AnimatedCharacterProps = {
  variant: "desktop" | "compact";
  className?: string;
};

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => true;

export default function AnimatedCharacter({ variant, className }: AnimatedCharacterProps) {
  const container = useRef<HTMLButtonElement>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId().replace(/:/g, "");
  // Motion's installed hook reads only the initial preference. Subscribe
  // directly so switching the OS setting also works without a page reload.
  const reduce = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const [available, setAvailable] = useState(false);
  const active = available && !reduce;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [waveReady, setWaveReady] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [greetingPulse, setGreetingPulse] = useState(false);
  const [idleWave, setIdleWave] = useState(false);
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);
  const idleStrength = useSpring(1, { stiffness: 110, damping: 22 });
  const nod = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const headX = useSpring(pointerX, CHARACTER.motion.headSpring);
  const headY = useSpring(pointerY, CHARACTER.motion.headSpring);
  const eyeX = useSpring(pointerX, CHARACTER.motion.eyeSpring);
  const eyeY = useSpring(pointerY, CHARACTER.motion.eyeSpring);
  const bodyX = useSpring(pointerX, CHARACTER.motion.bodySpring);
  const yaw = useTransform(() => clamp(headX.get() + idleX.get() * idleStrength.get()) * CHARACTER.motion.headYaw);
  const pitch = useTransform(() => clamp(-headY.get() + idleY.get() * idleStrength.get() + nod.get() * 0.6) * CHARACTER.motion.headPitch);
  const roll = useTransform(() => headX.get() * CHARACTER.motion.headRoll + idleX.get() * idleStrength.get() * 2.4);
  const shoulders = useTransform(() => bodyX.get() * 0.65 + idleX.get() * 2.2);
  const gazeX = useTransform(() => clamp(eyeX.get() + idleX.get() * idleStrength.get()) * CHARACTER.motion.eyeX);
  const gazeY = useTransform(() => clamp(eyeY.get() - idleY.get() * idleStrength.get()) * CHARACTER.motion.eyeY);
  const blink = useMotionValue(0);
  const showRig = ready && !failed && !reduce;
  const running = active && showRig;
  const greeting = available && (hovered || focused || greetingPulse);
  const waving = running && waveReady && (hovered || greetingPulse || idleWave);

  const sayHi = () => {
    clearTimeout(greetingTimer.current);
    setGreetingPulse(true);
    greetingTimer.current = setTimeout(() => setGreetingPulse(false), 2400);
  };

  useEffect(() => () => clearTimeout(greetingTimer.current), []);

  // CSS controls placement; observers prevent the hidden duplicate from
  // loading enhancement assets or running animations/listeners.
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const breakpoint = window.matchMedia("(min-width: 768px)");
    let inView = false;
    const sync = () => {
      const correctVariant = variant === "desktop" ? breakpoint.matches : !breakpoint.matches;
      const visible = correctVariant && inView && !document.hidden;
      setAvailable(visible);
      if (!visible) {
        setHovered(false);
        setFocused(false);
        setGreetingPulse(false);
        setIdleWave(false);
        clearTimeout(greetingTimer.current);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    breakpoint.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      breakpoint.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [variant]);

  useEffect(() => {
    if (!active || ready || failed) return;
    let cancelled = false;
    const images = Object.values(CHARACTER.sources).map((src) => {
      const image = new window.Image();
      image.src = src;
      return image;
    });
    // decode also rejects network errors, so a missing layer can never expose
    // white eyeballs or a partially assembled character.
    void Promise.all(images.map((image) => image.decode())).then(
      () => { if (!cancelled) setReady(true); },
      () => { if (!cancelled) setFailed(true); },
    );
    return () => { cancelled = true; };
  }, [active, ready, failed]);

  // The greeting is optional enhancement: its failure must not disable the
  // regular rig or prevent the accessible text greeting from appearing.
  useEffect(() => {
    if (!active || waveReady) return;
    let cancelled = false;
    const image = new window.Image();
    image.src = CHARACTER.wave.src;
    void image.decode().then(() => {
      if (!cancelled) setWaveReady(true);
    }, () => {});
    return () => { cancelled = true; };
  }, [active, waveReady]);

  // Glances and posture shifts happen even before the first pointer event.
  // Pointer activity temporarily blends the head back to direct tracking.
  useEffect(() => {
    if (!running) {
      idleX.jump(0);
      idleY.jump(0);
      return;
    }
    const glance = animate(idleX, [0, 0.65, 0.65, -0.55, -0.55, 0, 0], {
      duration: 10, times: [0, 0.16, 0.29, 0.51, 0.65, 0.83, 1],
      ease: "easeInOut", repeat: Infinity,
    });
    const posture = animate(idleY, [0, -0.25, 0.3, 0, 0], {
      duration: 6.8, ease: "easeInOut", repeat: Infinity,
    });
    let waveTimer: ReturnType<typeof setTimeout>;
    let restTimer: ReturnType<typeof setTimeout>;
    const scheduleWave = (delay: number) => {
      waveTimer = setTimeout(() => {
        setIdleWave(true);
        restTimer = setTimeout(() => {
          setIdleWave(false);
          scheduleWave(12000);
        }, 2200);
      }, delay);
    };
    scheduleWave(4200);
    return () => {
      glance.stop();
      posture.stop();
      clearTimeout(waveTimer);
      clearTimeout(restTimer);
      setIdleWave(false);
    };
  }, [running, idleX, idleY]);

  useEffect(() => {
    if (!waving) {
      nod.jump(0);
      return;
    }
    const welcome = animate(nod, [0, 1, -0.25, 0], {
      duration: 0.9, ease: "easeInOut",
    });
    return () => welcome.stop();
  }, [waving, nod]);

  useEffect(() => {
    if (!running) {
      pointerX.jump(0);
      pointerY.jump(0);
      headX.jump(0);
      headY.jump(0);
      eyeX.jump(0);
      eyeY.jump(0);
      bodyX.jump(0);
      idleStrength.jump(1);
      return;
    }
    const finePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    let rect = container.current?.getBoundingClientRect();
    let attentionTimer: ReturnType<typeof setTimeout>;
    const measure = () => { rect = container.current?.getBoundingClientRect(); };
    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
      setHovered(false);
      clearTimeout(attentionTimer);
      idleStrength.set(1);
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch" || !rect) return;
      clearTimeout(attentionTimer);
      idleStrength.set(0);
      attentionTimer = setTimeout(() => idleStrength.set(1), 1800);
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.3;
      // Normalize each side separately: the left-rail avatar can look across
      // the whole page without hitting its rotation limit near its own edge.
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      pointerX.set(clamp(dx / Math.max(120, dx < 0 ? centerX : innerWidth - centerX)));
      pointerY.set(clamp(dy / Math.max(120, dy < 0 ? centerY : innerHeight - centerY)));
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    const resize = new ResizeObserver(measure);
    if (container.current) resize.observe(container.current);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    window.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    finePointer.addEventListener("change", reset);
    return () => {
      clearTimeout(attentionTimer);
      resize.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      finePointer.removeEventListener("change", reset);
    };
  }, [running, pointerX, pointerY, headX, headY, eyeX, eyeY, bodyX, idleStrength]);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let animation: ReturnType<typeof animate> | undefined;
    const schedule = () => {
      timer = setTimeout(() => {
        animation = animate(blink, [0, 1, 1, 0], {
          duration: 0.18,
          times: [0, 0.35, 0.55, 1],
          ease: "easeInOut",
          onComplete: () => { if (!cancelled) schedule(); },
        });
      }, 3200 + Math.random() * 2600);
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      animation?.stop();
      blink.jump(0);
    };
  }, [running, blink]);

  const imageAttributes = { width: CHARACTER.size, height: CHARACTER.size };

  return (
    <button
      ref={container}
      type="button"
      aria-label="Divyanshu's animated portrait. Say hi."
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch" && window.matchMedia("(hover: hover)").matches) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onClick={sayHi}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setHovered(false);
          setFocused(false);
          setGreetingPulse(false);
          clearTimeout(greetingTimer.current);
        }
      }}
      className={cn(styles.character, styles[variant], className)}
      data-character={variant}
      data-animated={showRig}
      data-active={running}
      data-greeting={greeting}
      data-waving={waving}
    >
      <div className={styles.crop}>
        <div className={styles.artboard}>
          <Image
            src={CHARACTER.fallback}
            alt=""
            width={192}
            height={192}
            quality={75}
            loading="eager"
            draggable={false}
            className={styles.fallback}
          />
          {showRig && (
            <div className={styles.rig} aria-hidden="true">
              <div className={styles.breathe}>
                <motion.div className={styles.body} style={{ rotate: shoulders }}>
                  <svg viewBox={`0 0 ${CHARACTER.size} ${CHARACTER.size}`}>
                    {/* The generated neck extends underneath the jaw, so
                        independent head and shoulder motion cannot open a gap. */}
                    <image className={styles.restingBody} href={CHARACTER.sources.body} {...imageAttributes} />
                    {waveReady && (
                      <g className={styles.wavingBody}>
                        <defs>
                          <mask id={`${id}-wrist`} maskUnits="userSpaceOnUse" x="0" y="0" width={CHARACTER.size} height={CHARACTER.size}>
                            <rect width={CHARACTER.size} height={CHARACTER.size} fill="white" />
                            <rect {...CHARACTER.wave.fixedCutout} fill="black" />
                          </mask>
                          <clipPath id={`${id}-hand`}><rect {...CHARACTER.wave.handCutout} /></clipPath>
                        </defs>
                        <image href={CHARACTER.wave.src} {...imageAttributes} mask={`url(#${id}-wrist)`} />
                        <g className={styles.wavingHand} style={{ transformOrigin: CHARACTER.wave.wristOrigin }}>
                          <image href={CHARACTER.wave.src} {...imageAttributes} clipPath={`url(#${id}-hand)`} />
                        </g>
                      </g>
                    )}
                  </svg>
                </motion.div>
                <motion.div
                  className={styles.head}
                  style={{ rotateX: pitch, rotateY: yaw, rotateZ: roll, transformOrigin: CHARACTER.headOrigin }}
                >
                  <svg viewBox={`0 0 ${CHARACTER.size} ${CHARACTER.size}`}>
                    <defs>
                      <clipPath id={`${id}-head`}><path d={CHARACTER.headOutline} /></clipPath>
                      <clipPath id={`${id}-blink`}>
                        {CHARACTER.eyes.map((eye) => <ellipse key={eye.id} {...eye.blink} />)}
                      </clipPath>
                      {CHARACTER.eyes.map((eye) => (
                        <g key={eye.id}>
                          <clipPath id={`${id}-${eye.id}-opening`}><path d={eye.opening} /></clipPath>
                          <clipPath id={`${id}-${eye.id}-iris`}>
                            <circle cx={eye.cx} cy={eye.cy} r={eye.radius} />
                          </clipPath>
                        </g>
                      ))}
                    </defs>
                    <g clipPath={`url(#${id}-head)`}>
                      <image href={CHARACTER.sources.neutral} {...imageAttributes} />
                      {CHARACTER.eyes.map((eye) => (
                        <g key={eye.id} clipPath={`url(#${id}-${eye.id}-opening)`}>
                          <image href={CHARACTER.sources.eyes} {...imageAttributes} />
                          <motion.g style={{ x: gazeX, y: gazeY }}>
                            <image href={CHARACTER.sources.neutral} {...imageAttributes} clipPath={`url(#${id}-${eye.id}-iris)`} />
                          </motion.g>
                        </g>
                      ))}
                      <motion.g style={{ opacity: blink }} clipPath={`url(#${id}-blink)`}>
                        <image href={CHARACTER.sources.blink} {...imageAttributes} />
                      </motion.g>
                    </g>
                  </svg>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className={styles.greeting} aria-hidden="true">Hi!</span>
      <span className="sr-only" role="status">{greeting ? "Hi! Nice to meet you." : ""}</span>
    </button>
  );
}
