import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils"
import Sidebar from "@/components/system/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Área Do Professor - Engenharias Senac",
  description: "Desenvolvido por: Rafael Pequino Freire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          ${(cn(
            "min-h-full bg-background font-sans antialiased", 
          ))}
        `}
      >
        {/* <Sidebar /> */}
        {children}
      </div>
  );
}
