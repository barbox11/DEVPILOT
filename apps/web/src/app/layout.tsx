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
  title: "DevPilot",
  description:
    "Plataforma de asistencia con IA para desarrolladores: analiza código, detecta errores y vulnerabilidades, revisa calidad y arquitectura.",
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
      </head>
      <body
        className={`${jetbrainsMono.variable} ${ibmPlexSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
