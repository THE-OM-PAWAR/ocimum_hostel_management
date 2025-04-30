import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/lib/redux/provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OCIMUM - Modern Hostel Management System',
  description: 'Streamline your hostel and PG operations with our easy-to-use management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ReduxProvider>
              {children}
              <Toaster />
            </ReduxProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
