import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldontime.info"),
  title: {
    default: "World On Time | World Clock, Time Zone Converter and Timers",
    template: "%s | World On Time"
  },
  description:
    "Check the current time around the world, convert time zones, run countdowns, use a stopwatch, and stay focused with a Pomodoro timer.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "World On Time",
    description:
      "A fast, clean world clock, time zone converter, countdown, stopwatch, and Pomodoro timer.",
    url: "https://worldontime.info",
    siteName: "World On Time",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fa"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
