import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Editor",
  description: "Tauri-based Markdown blog editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
