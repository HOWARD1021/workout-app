import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workout App",
  description: "Track your workouts and progress",
  manifest: "/manifest.json",
  themeColor: "#58CC02",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Workout",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <WorkoutProvider>{children}</WorkoutProvider>
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
