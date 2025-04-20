import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/google-analytics";

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
      <head />
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
