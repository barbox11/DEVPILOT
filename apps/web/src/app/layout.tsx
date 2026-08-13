import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devpilot.app"),
  title: {
    default: "DevPilot — Análisis de código con IA",
    template: "%s · DevPilot",
  },
  description:
    "Plataforma de asistencia con IA para desarrolladores: analiza código, detecta errores y vulnerabilidades, revisa calidad y arquitectura.",
  applicationName: "DevPilot",
  keywords: [
    "análisis de código con IA",
    "revisión de código",
    "detección de vulnerabilidades",
    "calidad de software",
    "DevPilot",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "DevPilot",
    title: "DevPilot — Análisis de código con IA",
    description:
      "Analiza código, detecta errores y vulnerabilidades, revisa calidad y arquitectura con DevPilot.",
  },
  twitter: {
    card: "summary",
    title: "DevPilot — Análisis de código con IA",
    description:
      "Analiza código, detecta errores y vulnerabilidades, revisa calidad y arquitectura con DevPilot.",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem("devpilot-theme");
                var dark = stored
                  ? stored === "dark"
                  : window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (dark) document.documentElement.classList.add("dark");
              } catch (e) {}
            })();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DevPilot",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              inLanguage: "es",
              description:
                "Plataforma de asistencia con IA para desarrolladores: analiza código, detecta errores y vulnerabilidades, revisa calidad y arquitectura.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            }),
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <a
          href="#contenido"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:font-medium focus:text-on-ink"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
