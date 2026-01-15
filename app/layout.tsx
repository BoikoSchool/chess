import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOIKO CHESS",
  description: "Chess ratings for Boiko School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-background text-foreground overflow-hidden",
          montserrat.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
