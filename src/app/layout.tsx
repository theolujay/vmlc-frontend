
import AuthProvider from "@/contexts/AuthProvider";
import QueryProvider from "@/contexts/QueryProviders";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppErrorBoundary from "./AppErrorBoundary";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Verboheit Learning Management System",
  description: "Welcome to verboheit learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const routerReady=useRouterReady()
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AppErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
            </QueryProvider>
          </AuthProvider>
        </AppErrorBoundary>

      </body>
    </html>
  );
}
