import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nathan Liu",
  description: "Education path to career path — built from 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black">{children}</body>
    </html>
  );
}
