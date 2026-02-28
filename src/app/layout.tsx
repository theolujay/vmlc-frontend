import Script from "next/script";
import AuthProvider from "@/contexts/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { SocketProvider } from "@/contexts/SocketProvider";
import QueryProvider from "@/contexts/QueryProviders";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import AppErrorBoundary from "./AppErrorBoundary";
import Spinner from "@/components/ui/spinner/spinner";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

// ... (metadata unchanged)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const routerReady=useRouterReady()
  return (
    <html lang="en">
      {/* ... (head unchanged) */}
      <body
        className="antialiased"
      >
        <AppErrorBoundary>
          <AuthProvider>
            <SocketProvider>
              <NotificationProvider>
                <QueryProvider>
                  <Suspense fallback={<div className="grid w-full h-screen place-content-center"><Spinner/></div>}>
                    {children}
                  </Suspense>
                  <ToastContainer 
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </QueryProvider>
              </NotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </AppErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
