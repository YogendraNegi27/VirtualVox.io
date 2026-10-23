"use client";

import { useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type TouchEvent, type ReactNode } from "react";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { label: string; href: string; icon: ReactNode };

export type DitheredFooterProps = {
    brand?: string;
    /** Where the wordmark links to. */
    brandHref?: string;
    tagline?: string;
    columns?: FooterColumn[];
    socials?: FooterSocial[];
    legal?: FooterLink[];
    copyright?: string;
    /** Link to your real status page, shown with a green dot. Off unless you pass one. */
    status?: FooterLink | null;
    /** Colour of the dot field. It is the footer's only colour, so it carries the brand. */
    accent?: string;
    /** Called with the email address. Resolve to show the success message. */
    onSubscribe?: (email: string) => void | Promise<void>;
    showBackToTop?: boolean;
    className?: string;
};

const toLinks = (labels: string[]): FooterLink[] =>
    labels.map((label) => ({ label, href: "/" + label.toLowerCase().replace(/\s+/g, "-") }));

const icon = (d: string) => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

const DEFAULT_SOCIALS: FooterSocial[] = [
    { label: "X", href: "https://x.com", icon: icon("M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z") },
    { label: "GitHub", href: "https://github.com", icon: icon("M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5") },
    { label: "LinkedIn", href: "https://linkedin.com", icon: icon("M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z") },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
    { title: "Product", links: toLinks(["Features", "Pricing", "Changelog", "Roadmap"]) },
    { title: "Resources", links: toLinks(["Docs", "Guides", "Community", "Blog"]) },
    { title: "Company", links: toLinks(["About", "Careers", "Contact", "Press"]) },
];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]";
const coarse = "[@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:items-center";

export default function DitheredFooter({
    brand = "VIRTUALVOX",
    brandHref = "#top",
    tagline = "Remarkably human AI voice and text agents. Never miss another opportunity, answer every call in seconds, and make every customer conversation count.",
    columns = DEFAULT_COLUMNS,
    socials = DEFAULT_SOCIALS,
    legal = toLinks(["Privacy", "Terms"]),
    copyright = `© ${new Date().getFullYear()} VIRTUALVOX, Inc. All rights reserved.`,
    status = null,
    accent = "#7c3aed",
    onSubscribe,
    showBackToTop = false,
    className = "",
}: DitheredFooterProps) {
    const [email, setEmail] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
    const field = useRef<HTMLDivElement>(null);
    const frame = useRef(0);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setState("sending");
        try {
            await onSubscribe?.(email);
            setState("done");
            setEmail("");
        } catch {
            setState("error");
        }
    };

    // Spotlight: dots under mouse, touch, or tap stay at full strength and the rest dim.
    // Works seamlessly on desktop, laptops, tablets, and mobile smartphones.
    const setSpotlight = (clientX: number, clientY: number) => {
        if (!field.current) return;
        const el = field.current;
        const r = el.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            el.style.setProperty("--df-x", `${x}px`);
            el.style.setProperty("--df-y", `${y}px`);
            el.classList.add("df-lit");
        });
    };

    const handlePointer = (e: PointerEvent<HTMLDivElement>) => {
        setSpotlight(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches && e.touches[0]) {
            setSpotlight(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const onLeave = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse") {
            cancelAnimationFrame(frame.current);
            field.current?.classList.remove("df-lit");
        }
    };

    const toTop = () =>
        window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

    return (
        <footer
            className={`df-light-footer-root ${className}`}
            style={{ "--df-accent": accent } as CSSProperties}
        >
            <div className="relative z-10 mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] gap-y-7 md:gap-x-8 lg:gap-x-12 px-5 pb-5 pt-6 sm:px-8 sm:pb-7 sm:pt-7 max-w-6xl">
                {/* Brand & Newsletter Column */}
                <div className="w-full max-w-md">
                    <a
                        href={brandHref}
                        className={`block text-2xl sm:text-[1.65rem] font-extrabold tracking-tight bg-gradient-to-r from-[#1f1636] via-[#3a2862] to-[#7c3aed] bg-clip-text text-transparent hover:opacity-90 ${focus}`}
                    >
                        {brand}
                    </a>
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#564a70] max-w-sm">
                        {tagline}
                    </p>

                    {/* Sleek, attractive integrated newsletter subscription */}
                    <div className="mt-4 max-w-[290px]">
                        <form onSubmit={submit}>
                            <label htmlFor="df-email" className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#473b64] mb-1">
                                Get product updates & drops
                            </label>
                            <div className="relative flex items-center rounded-full bg-white/95 border border-purple-200/90 p-1 shadow-2xs transition-all duration-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:bg-white">
                                <input
                                    id="df-email"
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
                                    className="h-7 min-w-0 flex-1 bg-transparent px-3 text-xs text-[#241d35] placeholder:text-[#988eaf] focus:outline-none"
                                />
                                <button
                                    disabled={state === "sending"}
                                    className={`h-7 px-3.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-2xs active:scale-95 disabled:opacity-60 cursor-pointer ${focus}`}
                                >
                                    {state === "sending" ? "..." : "Subscribe"}
                                </button>
                            </div>
                            <p role="status" className="mt-1 min-h-4 text-[11px] text-purple-700 font-medium">
                                {state === "done" && "✨ Thanks for subscribing! You're on the list."}
                                {state === "error" && "⚠️ That didn't go through. Please try again."}
                            </p>
                        </form>
                    </div>
                </div>

                {/* Navigation Columns (Clean 3-column / 2-column responsive layout with balanced text spacing) */}
                <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:contents gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6">
                    {columns.map((col) => (
                        <nav key={col.title} aria-label={col.title}>
                            <div className="flex items-center gap-1.5 mb-2 sm:mb-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed] shadow-[0_0_6px_rgba(124,58,237,0.4)]" />
                                <p className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#342750]">{col.title}</p>
                            </div>
                            <ul className="list-none p-0 m-0 space-y-1 sm:space-y-1.5">
                                {col.links.map((l) => (
                                    <li key={l.label} className="list-none p-0 m-0">
                                        <a
                                            href={l.href}
                                            className={`df-link inline-flex items-center py-0.5 text-xs sm:text-[13px] font-normal leading-snug text-[#584e6d] hover:text-[#7c3aed] transition-colors duration-150 ${focus}`}
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>
            </div>

            {/* Dither Dot Band with Clear Cutout Brand Wordmark */}
            <div
                aria-hidden="true"
                className="df-band relative h-28 sm:h-36 md:h-44 lg:h-48 overflow-hidden border-t border-purple-200/60 cursor-crosshair select-none touch-none"
                onPointerDown={handlePointer}
                onPointerMove={handlePointer}
                onPointerLeave={onLeave}
                onTouchStart={handleTouch}
                onTouchMove={handleTouch}
            >
                <div ref={field} className="df-field">
                    <div className="df-dots" />
                </div>
                {/* Wordmark punched out clearly with crisp outline and matching bottom light tone */}
                <p className="df-mark df-mark-text pointer-events-none absolute -bottom-[0.05em] left-3 select-none text-[clamp(2.4rem,13vw,11.5rem)] font-extrabold leading-[0.8] tracking-[-0.06em] sm:left-6">
                    {brand}
                </p>
            </div>

            {/* Bottom Bar: Copyright & Socials */}
            <div className="border-t border-purple-200/60 bg-white/70 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-2.5 text-xs text-[#63557a] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                        <p className="font-medium text-[#463960]">{copyright}</p>
                        {legal.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className={`rounded-sm transition-colors hover:text-[#7c3aed] ${focus} ${coarse}`}
                            >
                                {l.label}
                            </a>
                        ))}
                        {status && (
                            <a href={status.href} className={`inline-flex items-center gap-2 rounded-sm transition-colors hover:text-[#7c3aed] ${focus} ${coarse}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" aria-hidden="true" />
                                {status.label}
                            </a>
                        )}
                    </div>
                    <div className="-mr-1 flex items-center gap-1.5">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className={`df-social-btn grid h-8 w-8 place-items-center rounded-lg ${focus} [@media(pointer:coarse)]:h-9 [@media(pointer:coarse)]:w-9`}
                            >
                                {s.icon}
                            </a>
                        ))}
                        {showBackToTop && (
                            <>
                                <span className="mx-1.5 h-3.5 w-px bg-purple-200/80" aria-hidden="true" />
                                <button type="button" onClick={toTop} className={`inline-flex items-center gap-1.5 rounded-sm px-1 transition-colors hover:text-[#7c3aed] ${focus} ${coarse}`}>
                                    Back to top
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export { DitheredFooter };
