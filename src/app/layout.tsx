import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KR Pharma - ร้านขายยาออนไลน์",
  description: "ร้านขายยาออนไลน์ที่มีทั้งยาและผลิตภัณฑ์เพื่อสุขภาพครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
