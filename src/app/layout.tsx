import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/QueryProviders";
import { Suspense } from "react";
import AuthProvider from "@/contexts/AuthProvider";

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
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
