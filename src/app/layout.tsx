import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";
import { AuthInitializer } from "@/components/auth/AuthInitialiser";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { User } from "lucide-react";
import { Music } from "lucide-react";
import { Home } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Karaoke App",
  description: "A modern karaoke application for singing along with your favorite songs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer />
        <div className="relative min-h-screen">
          <main className="relative z-0">{children}</main>
          <NavBar />
        </div>
      </body>
    </html>
  );
}
