import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asset Room",
  description: "A premium UI resource library — never lose a great resource again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sourceSans.variable} ${cormorant.variable} antialiased bg-canvas text-ink`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
