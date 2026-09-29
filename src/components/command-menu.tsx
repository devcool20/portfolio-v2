"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion, useReducedMotion } from "framer-motion"
import {
    LayoutDashboard,
    Moon,
    Sun,
    Laptop,
    Code,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Copy,
    Check,
    Briefcase,
    BookOpen,
} from "lucide-react"
import { SiGithub } from "react-icons/si"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useToast } from "@/components/Toast"

const SECTIONS = [
    { id: "#experience", label: "Experience", icon: Briefcase, key: "E" },
    { id: "#projects", label: "Projects", icon: Code, key: "P" },
    { id: "#blogs", label: "Blogs", icon: LayoutDashboard, key: "B" },
    { id: "#opensource", label: "Open Source", icon: SiGithub, key: "O" },
    { id: "#skills", label: "Skills", icon: BookOpen, key: "S" },
] as const

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const { setTheme } = useTheme()
    const { notify } = useToast()
    const reduce = useReducedMotion()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const copyLink = React.useCallback(async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
        } catch {
            // Clipboard API needs a secure context; fall back to a selection.
            const field = document.createElement("input")
            field.value = url
            document.body.appendChild(field)
            field.select()
            try {
                document.execCommand("copy")
            } finally {
                document.body.removeChild(field)
            }
        }
        setCopied(true)
        notify("Link copied to clipboard", <Check className="h-3.5 w-3.5 text-emerald-500" />)
        window.setTimeout(() => setCopied(false), 1600)
    }, [notify])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (!open || !e.shiftKey) return

            const target = e.target as HTMLElement
            const isTypingField =
                target.isContentEditable ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT"

            if (!isTypingField) return

            const key = e.key.toLowerCase()
            const section = SECTIONS.find((s) => s.key.toLowerCase() === key)
            if (section) {
                e.preventDefault()
                runCommand(() => { window.location.hash = section.id })
                return
            }

            switch (key) {
                case "c":
                    e.preventDefault()
                    runCommand(() => void copyLink())
                    break
                case "t":
                    e.preventDefault()
                    runCommand(() => setTheme("light"))
                    break
                case "d":
                    e.preventDefault()
                    runCommand(() => setTheme("dark"))
                    break
                case "y":
                    e.preventDefault()
                    runCommand(() => setTheme("system"))
                    break
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, runCommand, setTheme, copyLink])

    const item = "group flex cursor-pointer items-center rounded-lg py-3"

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open command menu"
                className="group relative cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:translate-y-0 active:scale-95"
            >
                <span
                    aria-hidden
                    className="absolute -inset-[4.5px] rounded-[9px] border border-black/5 transition-colors duration-200 group-hover:border-black/10 dark:border-white/5 dark:group-hover:border-white/15"
                />
                <span className="relative flex items-center gap-1.5 rounded-[5px] border border-black/5 bg-ink-sunken px-3 py-1 font-mono text-[11px] font-medium text-zinc-500 shadow-sm shadow-black/5 transition-colors duration-200 hover:bg-ink-raised hover:text-zinc-900 dark:border-white/5 dark:bg-ink-sunken dark:text-zinc-400 dark:shadow-lg dark:shadow-black/40 dark:hover:text-zinc-100">
                    <span className="mt-[0.5px] leading-none">⌘</span>
                    <span className="mt-[0.5px] leading-none">K</span>
                </span>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="flex items-center gap-4 border-b border-zinc-100 p-4 dark:border-zinc-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Navigation Menu</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Quickly jump to sections or actions</p>
                    </div>
                </div>

                <CommandInput placeholder="Search for actions..." className="border-none focus:ring-0" />

                <CommandList className="p-2">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <motion.div
                        variants={{
                            hidden: reduce ? {} : { opacity: 0, y: -4 },
                            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02 } },
                        }}
                        initial={reduce ? undefined : "hidden"}
                        animate="visible"
                    >
                        <CommandGroup heading="Sections">
                            {SECTIONS.map(({ id, label, icon: Icon, key }) => (
                                <CommandItem
                                    key={id}
                                    onSelect={() => runCommand(() => { window.location.hash = id })}
                                    className={item}
                                >
                                    <Icon className="mr-2 h-4 w-4 text-zinc-500" />
                                    <span>{label}</span>
                                    <CommandShortcut className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                                        shift + {key}
                                    </CommandShortcut>
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator className="my-2" />

                        <CommandGroup heading="General">
                            <CommandItem onSelect={() => runCommand(() => void copyLink())} className={item}>
                                {copied ? (
                                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                                ) : (
                                    <Copy className="mr-2 h-4 w-4 text-zinc-500" />
                                )}
                                <span>{copied ? "Copied" : "Copy Link"}</span>
                                <CommandShortcut className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                                    shift + C
                                </CommandShortcut>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator className="my-2" />

                        <CommandGroup heading="Theme">
                            {([
                                { label: "Light Mode", icon: Sun, theme: "light", key: "T" },
                                { label: "Dark Mode", icon: Moon, theme: "dark", key: "D" },
                                { label: "System", icon: Laptop, theme: "system", key: "Y" },
                            ] as const).map(({ label, icon: Icon, theme, key }) => (
                                <CommandItem
                                    key={theme}
                                    onSelect={() => runCommand(() => setTheme(theme))}
                                    className={item}
                                >
                                    <Icon className="mr-2 h-4 w-4 text-zinc-500" />
                                    <span>{label}</span>
                                    <CommandShortcut className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                                        shift + {key}
                                    </CommandShortcut>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </motion.div>
                </CommandList>

                <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1">
                            <ArrowUp className="h-3 w-3" />
                            <ArrowDown className="h-3 w-3" />
                            <span>to navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CornerDownLeft className="h-3 w-3" />
                            <span>to select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <span className="font-mono">esc</span>
                        <span>to close</span>
                    </div>
                </div>
            </CommandDialog>
        </>
    )
}
