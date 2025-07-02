"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MuiThemeProvider } from "@/components/layout/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} min-h-screen flex flex-col bg-surface`}
      >
        <SessionProvider>
          <MuiThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </MuiThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
