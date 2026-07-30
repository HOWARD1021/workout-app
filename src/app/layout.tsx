import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Workout",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QKN4XZTV6S"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QKN4XZTV6S');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NODE_ENV !== "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                  if (!("serviceWorker" in navigator)) return;
                  navigator.serviceWorker.getRegistrations()
                    .then(function (registrations) {
                      return Promise.all(registrations.map(function (registration) {
                        return registration.unregister();
                      }));
                    })
                    .then(function () {
                      if (!("caches" in window)) return;
                      return caches.keys().then(function (keys) {
                        return Promise.all(keys.map(function (key) {
                          return caches.delete(key);
                        }));
                      });
                    })
                    .catch(function () {});
                })();
              `,
            }}
          />
        )}
        <I18nProvider>
          {children}
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
