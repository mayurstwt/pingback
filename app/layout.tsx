import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Pingback — Heartbeat alerts for no-code automations",
  description:
    "Know the instant your Zapier, Make, or GoHighLevel automation goes silent. Dead-simple heartbeat monitoring with email alerts.",
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Pingback — Heartbeat alerts for no-code automations",
    description:
      "Know the instant your Zapier, Make, or GoHighLevel automation goes silent. Dead-simple heartbeat monitoring with email alerts.",
    siteName: "Pingback",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pingback — Heartbeat alerts for no-code automations",
    description:
      "Know the instant your Zapier, Make, or GoHighLevel automation goes silent.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>{children}</body>
    </html>
  );
}
