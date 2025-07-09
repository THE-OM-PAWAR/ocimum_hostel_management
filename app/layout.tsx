import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OCIMUM - Modern Hostel Management System",
  description: "Streamline your hostel and PG operations with our easy-to-use management system",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  icons: {
    apple: "/maskable_icon_x192(1).png",
  },
  themeColor: "#73ddb5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OCIMUM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="application-name" content="OCIMUM" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="OCIMUM" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#73ddb5" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#73ddb5" />

          <link rel="apple-touch-icon" href="/maskable_icon_x192(1).png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/maskable_icon_x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/maskable_icon_x192(1).png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/maskable_icon_x192(1).png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/maskable_icon_x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/maskable_icon_x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/maskable_icon_x192(1).png" color="#73ddb5" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              {children}
              <Toaster />
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}