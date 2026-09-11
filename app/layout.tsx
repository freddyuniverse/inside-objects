import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inside Objects | An interactive 3D collection",
  description: "Look inside everyday technology. Rotate, unfold, and explore Oura Ring 4 and iPhone 16 Pro in 3D.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
