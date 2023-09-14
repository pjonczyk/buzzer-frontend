import { useBearStore } from "@/sessionState";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buzzer",
  description: "Buzzer web application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          "bg-slate-900 text-slate-400 leading-relaxed selection:bg-teal-300 selection:text-teal-900" +
          " " +
          inter.className
        }
      >
        {children}
      </body>
    </html>
  );
}
