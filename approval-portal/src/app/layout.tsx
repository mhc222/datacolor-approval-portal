import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Content Approval | Datacolor",
  description: "Review and approve social media content for Datacolor",
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
