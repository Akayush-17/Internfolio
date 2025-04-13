import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interfolio",
  description: "Create report for internship review nice and smooth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
