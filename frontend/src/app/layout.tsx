import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title:       "ShopFlow — Premium Tech Store",
  description: "Top-rated gear for developers, designers, and power users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-200 mt-16">
          © 2026 ShopFlow · All rights reserved
        </footer>
      </body>
    </html>
  );
}
