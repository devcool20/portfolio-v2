import type { Metadata } from "next";
import { Geist, Geist_Mono, Doto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Dot-matrix display face, used by the hero clock. Self-hosted via next/font
 *  so it stops being a render-blocking third-party request. */
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://divyanshusharma.vercel.app"),
  title: "Divyanshu Sharma — Engineer & Builder",
  description:
    "Portfolio website for Divyanshu Sharma featuring an about summary, selected projects, and social links.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Divyanshu Sharma — Engineer & Builder",
    description:
      "Portfolio website for Divyanshu Sharma featuring an about summary, selected projects, and social links.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 460,
        height: 460,
        alt: "Divyanshu Sharma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divyanshu Sharma — Engineer & Builder",
    description:
      "Portfolio website for Divyanshu Sharma featuring an about summary, selected projects, and social links.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:border focus:border-black/10 focus:bg-ink-raised focus:px-3 focus:py-2 focus:text-[13px] focus:font-medium focus:text-zinc-900 dark:focus:border-white/15 dark:focus:bg-ink-raised dark:focus:text-zinc-100"
          >
            Skip to content
          </a>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
