import { getImageProps } from "next/image";

// All artwork shares the same 1254px canvas. Coordinates are measured from
// the master, so the eyes, neck joint, and blink stay registered at any size.
const source = (name: string) => `/character/${name}-v2.png`;
const asset = (name: string) =>
  getImageProps({
    src: source(name),
    alt: "",
    width: 192,
    height: 192,
    quality: 75,
  }).props.src;

export const CHARACTER = {
  size: 1254,
  fallback: source("neutral"),
  wave: {
    src: asset("wave"),
    wristOrigin: "225px 485px",
    fixedCutout: { x: 0, y: 0, width: 420, height: 478 },
    handCutout: { x: 0, y: 0, width: 420, height: 500 },
  },
  sources: {
    neutral: asset("neutral"),
    body: asset("body"),
    eyes: asset("eyes-base"),
    blink: asset("blink"),
  },
  headOrigin: "49.8% 35.6%",
  headOutline:
    "M0 0H1254V365H735C734 393 716 421 685 444C665 455 632 457 607 450C567 440 535 421 525 395L517 365H0Z",
  eyes: [
    {
      id: "left",
      cx: 584,
      cy: 277,
      radius: 11.5,
      blink: { cx: 584, cy: 280, rx: 34, ry: 17 },
      opening:
        "M558 280C574 269 592 266 609 278C595 287 575 290 558 280Z",
    },
    {
      id: "right",
      cx: 681,
      cy: 267,
      radius: 10.5,
      blink: { cx: 682, cy: 270, rx: 29, ry: 16 },
      opening:
        "M661 272C670 260 686 259 701 267C690 277 674 279 661 272Z",
    },
  ],
  motion: {
    headYaw: 8,
    headPitch: 5,
    headRoll: 1.5,
    eyeX: 4,
    eyeY: 2.5,
    headSpring: { stiffness: 260, damping: 30, mass: 0.7 },
    eyeSpring: { stiffness: 420, damping: 32, mass: 0.6 },
    bodySpring: { stiffness: 120, damping: 25, mass: 1 },
  },
} as const;
