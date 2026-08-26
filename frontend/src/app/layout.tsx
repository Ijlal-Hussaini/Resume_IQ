import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ResumeIQ — AI-Powered Career Intelligence & Agentic CV Parser",
  description:
    "Production-grade AI career intelligence system powered by LangGraph, RAG with grounded citations, multi-domain structured extraction, and bullet-level Google XYZ rewrites.",
  keywords: [
    "AI Resume Parser",
    "LangGraph",
    "RAG",
    "Career Intelligence",
    "ATS Optimization",
    "Groq Llama 3",
    "Google Gemini",
    "Next.js",
    "FastAPI"
  ],
  authors: [{ name: "ResumeIQ Intelligence" }],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200 transition-colors duration-300">
        {/* Liquid Glass Ambient Gradient Orbs */}

        <div className="ambient-orb-1" aria-hidden="true" />
        <div className="ambient-orb-2" aria-hidden="true" />
        <div className="ambient-orb-3" aria-hidden="true" />
        
        {/* Main Application Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
