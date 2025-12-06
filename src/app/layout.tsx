import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "جلاجل - منصة الذكاء الاصطناعي المفتوحة",
  description: "منصة جلاجل المتقدمة لإدارة وتطوير نماذج الذكاء الاصطناعي المفتوحة المصدر. مصممة لتوفير توازن مثالي بين الكفاءة والدقة مع سهولة الاستخدام والتكامل.",
  keywords: ["جلاجل", "الذكاء الاصطناعي", "منصة مفتوحة", "Next.js", "TypeScript", "Tailwind CSS", "نماذج ذكاء اصطناعي", "AI platform"],
  authors: [{ name: "فريق جلاجل" }],
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "جلاجل - منصة الذكاء الاصطناعي المفتوحة",
    description: "منصة متقدمة لإدارة وتطوير نماذج الذكاء الاصطناعي المفتوحة المصدر",
    url: "https://jaljal.ai",
    siteName: "جلاجل",
    type: "website",
    images: [
      {
        url: "/banner.png",
        width: 1440,
        height: 720,
        alt: "منصة جلاجل للذكاء الاصطناعي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جلاجل - منصة الذكاء الاصطناعي المفتوحة",
    description: "منصة متقدمة لإدارة وتطوير نماذج الذكاء الاصطناعي المفتوحة المصدر",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
