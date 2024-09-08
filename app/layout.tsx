import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "YOOM",
  description: "Free Video Calling App",
  icons: {
    icon: "/icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            logoImageUrl: "/icons/yoom-logo.svg",
            socialButtonsVariant: "iconButton",
          },
          variables: {
            colorText: "#fff",
            colorPrimary: "#0e78f9",
            colorBackground: "#1c1f2e",
            colorInputBackground: "#252a41",
            colorInputText: "#fff",
          },
        }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-dark-2 antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </ClerkProvider>

    </html>
  );
}
