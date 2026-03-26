import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Engenharias Senac",
  description: "Desenvolvido por: Rafael Pequino Freire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">

      <head>
        <link rel="icon" href="/img/favicon/favicon.ico" />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          ${(cn(
          "min-h-full bg-background font-sans antialiased max-w-[1920px] m-auto",
        ))}
        `}
      >
        {children}
      </body>
    </html>
  );
}
