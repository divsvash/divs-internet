import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "divs.internet",
  description: "Divs' personal corner of the internet, disguised as a Windows computer.",
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
