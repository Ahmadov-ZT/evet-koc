import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Events App",
  description: "The Hub For Every Dev Event You Need To Know About",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "min-h-screen",
        "h-full",
        "antialiased",
        schibstedGrotesk.variable,
        martianMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="absolute top-0 inset-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
            pulsating={false}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
