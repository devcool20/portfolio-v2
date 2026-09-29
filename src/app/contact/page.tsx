"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, AlertCircle, ArrowUpRight } from "lucide-react";

import { PageShell, HeroClock } from "@/components/shell/page-shell";
import { FooterBackground } from "@/components/FooterBackground";
import { RightNavbar } from "@/components/RightNavbar";
import { Rule } from "@/components/blueprint/rule";
import { FlightButton } from "@/components/FlightButton";
import DisplacementText from "@/components/DisplacementText";
import SocialHoverCard from "@/components/pixel-perfect/social-hover-card";
import { EASE_DRAFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const MAX_MESSAGE = 1200;

const AUTOFILL_CSS = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--autofill-text) !important;
    -webkit-box-shadow: 0 0 0px 1000px var(--autofill-bg) inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  :root { --autofill-bg: #ffffff; --autofill-text: #171717; }
  .dark { --autofill-bg: #080a0f; --autofill-text: #eef1f7; }
`;

const socials = [
  {
    name: "GitHub",
    href: "https://github.com/devcool20",
    path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  },
  {
    name: "Twitter",
    href: "https://x.com/dshxrmx",
    path: "M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/divyanshu-sharma-b9b534113/",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  const errors = {
    name: formData.name.trim() === "" ? "Required" : null,
    email:
      formData.email.trim() === ""
        ? "Required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
          ? "That doesn't look like an email"
          : null,
    message:
      formData.message.trim() === ""
        ? "Required"
        : formData.message.trim().length < 10
          ? "A little more detail, please"
          : null,
  };

  const isFormValid = !errors.name && !errors.email && !errors.message;
  const isSubmitting = status === "sending";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setTouched({ name: true, email: true, message: true });
    if (!isFormValid) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("https://formsubmit.co/ajax/as1142120@gmail.com", {
        method: "POST",
        body: data,
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      setStatus("sent");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
    }
  };

  const field = (key: keyof typeof formData) => {
    const invalid = Boolean(touched[key] && errors[key]);
    return {
      "aria-invalid": (invalid || undefined) as "true" | undefined,
      "aria-describedby": invalid ? (`${key}-error` as string) : undefined,
      className: cn(
        "w-full border-b bg-transparent px-4 py-3 text-[14px] text-zinc-900 outline-none transition-[border-color,background-color] duration-200",
        "placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600",
        "focus:bg-ink-sunken/40",
        invalid
          ? "border-rose-500 focus:border-rose-500"
          : "border-zinc-200 focus:border-zinc-500 dark:border-zinc-800 dark:focus:border-zinc-400",
      ),
    };
  };

  return (
    <PageShell
      rail={<RightNavbar />}
      hero={
        <>
          <style dangerouslySetInnerHTML={{ __html: AUTOFILL_CSS }} />
          <FooterBackground />
          <HeroClock />
        </>
      }
      title="Contact"
      subtitle="Open for meaningful work"
      back
    >
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8" noValidate>
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_subject" value="New Submission from Portfolio" />
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <Field label="Full name" htmlFor="name" error={touched.name ? errors.name : null}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Tyler Durden"
            value={formData.name}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            onChange={(e) => {
              setFormData((f) => ({ ...f, name: e.target.value }));
              if (status === "error" || status === "sent") setStatus("idle");
            }}
            {...field("name")}
          />
        </Field>

        <Field label="Email address" htmlFor="email" error={touched.email ? errors.email : null}>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="tyler@projectmayhem.com"
            value={formData.email}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onChange={(e) => {
              setFormData((f) => ({ ...f, email: e.target.value }));
              if (status === "error" || status === "sent") setStatus("idle");
            }}
            {...field("email")}
          />
        </Field>

        <Field
          label="Message"
          htmlFor="message"
          error={touched.message ? errors.message : null}
          hint={`${formData.message.length} / ${MAX_MESSAGE}`}
        >
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={MAX_MESSAGE}
            placeholder="You're crazy good, never change."
            value={formData.message}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            onChange={(e) => {
              setFormData((f) => ({ ...f, message: e.target.value }));
              if (status === "error" || status === "sent") setStatus("idle");
            }}
            {...field("message")}
            className={cn(field("message").className, "resize-none")}
          />
        </Field>

        {/* Submit row */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="group relative">
            <span
              aria-hidden
              className="absolute -inset-[5px] rounded-[11px] border border-black/5 transition-colors duration-200 group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/15"
            />
            <FlightButton
              type="submit"
              disabled={isSubmitting || status === "sent"}
              busy={isSubmitting}
              label={status === "sent" ? "Message sent" : "Send Message"}
              className="!relative !rounded-[6px] !border-black/5 !bg-ink-sunken !px-4 !py-2 !text-[13px] !font-medium !text-zinc-600 !shadow-sm !shadow-black/5 !transition-all !duration-200 hover:!-translate-y-px hover:!bg-ink-raised hover:!text-zinc-900 dark:!border-white/5 dark:!bg-ink-sunken dark:!text-zinc-400 dark:!shadow-lg dark:!shadow-black/40 dark:hover:!bg-ink-raised dark:hover:!text-zinc-100"
            />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" && (
              <motion.p
                key="sent"
                role="status"
                initial={reduce ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: EASE_DRAFT }}
                className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                Message sent — I&apos;ll get back to you shortly.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                key="error"
                role="alert"
                initial={reduce ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: EASE_DRAFT }}
                className="flex items-center gap-1.5 text-[13px] font-medium text-rose-600 dark:text-rose-400"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {touched.name || touched.email || touched.message
                  ? "Check the highlighted fields."
                  : "That didn't send. Try again, or email me directly."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>

      <div className="relative mt-16">
        <Rule side="bottom" bleed nodes={["start", "end"]} />
      </div>

      {/* Footer row */}
      <div className="flex flex-col items-start justify-between gap-8 overflow-hidden px-4 pb-5 pt-4 md:flex-row md:items-center">
        <div className="shrink-0">
          <p className="mb-2 text-[14px] text-zinc-500">
            Find me on my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span>
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {socials.map((social) => (
              <li key={social.name}>
                <SocialHoverCard socialName={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 rounded-md border border-zinc-200/50 bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-black/15 hover:bg-zinc-200 dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:border-white/15 dark:hover:bg-zinc-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path d={social.path} stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    {social.name}
                  </a>
                </SocialHoverCard>
              </li>
            ))}
            <li>
              <a
                href="mailto:as1142120@gmail.com"
                className="group flex items-center gap-1.5 rounded-md border border-zinc-200/50 bg-zinc-100 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-black/15 hover:bg-zinc-200 dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:border-white/15 dark:hover:bg-zinc-800"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="relative -mr-56 mt-2 h-[160px] w-full max-w-[420px] shrink-0 grow">
          <DisplacementText
            text="DIVYANSHU"
            fontSize={300}
            className="h-full w-full"
            lightColor="#171717"
            darkColor="#e5e5e5"
          />
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-4">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-500"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[11px] tabular-nums text-zinc-400 dark:text-zinc-600">{hint}</span>
        )}
      </div>

      {children}

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE_DRAFT }}
            className="overflow-hidden px-4 text-[12px] font-medium text-rose-600 dark:text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
