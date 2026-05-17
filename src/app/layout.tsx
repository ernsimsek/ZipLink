import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZipLink — Compress. Share. Track.",
  description:
    "ZipLink is a blazing-fast URL shortener with powerful analytics, QR codes, custom slugs, UTM builder, and link management — all in a beautifully electric design.",
  keywords: ["url shortener", "link shortener", "qr code", "analytics", "utm builder"],
  openGraph: {
    title: "ZipLink — Compress. Share. Track.",
    description: "Blazing-fast URL shortener with analytics & QR codes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{children}</body>
    </html>
  );
}
