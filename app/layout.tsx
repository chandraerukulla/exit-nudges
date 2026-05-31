import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exit Nudges — NRE/NRO Onboarding",
  description: "Contextual exit nudge prototype for Aspora NRE/NRO account onboarding.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-secondary text-on-surface-primary antialiased">
        {children}
      </body>
    </html>
  );
}
