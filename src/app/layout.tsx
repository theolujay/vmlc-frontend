import Script from "next/script";
import AuthProvider from "@/contexts/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import QueryProvider from "@/contexts/QueryProviders";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';
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
  title: "Verboheit MLC Portal",
  description: "Official portal for the Verboheit Mathematics League Competition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const routerReady=useRouterReady()
  return (
    <html lang="en">
      <head>
        <Script id="mathjax-config" strategy="beforeInteractive">
          {`
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true
              },
              options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
              },
              startup: {
                pageReady: () => {
                  return MathJax.startup.defaultPageReady();
                }
              },
              svg: {
                fontCache: 'global'
              }
            };
          `}
        </Script>
        <Script 
          src="https://cdn.jsdelivr.net/npm/mathjax@4.0.0-beta.7/tex-mml-chtml.js" 
          strategy="afterInteractive"
        />
      </head>
      <body
        className="antialiased"
      >
        <AppErrorBoundary>
          <AuthProvider>
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
          </AuthProvider>
        </AppErrorBoundary>

      </body>
    </html>
  );
}
