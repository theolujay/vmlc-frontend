import AuthProvider from "@/contexts/AuthProvider";
import QueryProvider from "@/contexts/QueryProviders";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {ToastContainer} from 'react-toastify'
import AppErrorBoundary from "./AppErrorBoundary";
import Spinner from "@/components/ui/spinner/spinner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Verboheit Mathematics League Competiton",
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
        className="antialiased"
      >
        <AppErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <Suspense fallback={<div className="grid w-full h-screen place-content-center"><Spinner/></div>}>
                {children}
              </Suspense>
              <ToastContainer/>
            </QueryProvider>
          </AuthProvider>
        </AppErrorBoundary>

      </body>
    </html>
  );
}
