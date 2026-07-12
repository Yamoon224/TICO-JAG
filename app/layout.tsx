import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/lib/locale-context";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const barlowCondensed = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800", "900"],
    variable: "--font-barlow-condensed",
    display: "swap",
});

export const metadata: Metadata = {
    title: "JAG & Atlético de Colèah | Site Officiel",
    description:
        "Site officiel de la Jaguar Académie Guinée (JAG) et du Club Atlético de Colèah — Cadets, Juniors, Seniors à Conakry, Guinée.",
    keywords: ["football", "guinée", "conakry", "jaguar académie", "atlético colèah", "JAG"],
    icons: {
        icon: "/images/jag-logo.png",
        shortcut: "/images/jag-logo.png",
        apple: "/images/jag-logo.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={`${inter.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
            <body className="font-sans antialiased bg-background text-foreground">
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                    <LocaleProvider>
                        {children}
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
