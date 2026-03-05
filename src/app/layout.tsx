import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PremiumLayout } from "@/components/layout/PremiumLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OOP Visualizer - Master Java Object-Oriented Programming",
  description: "Interactive visualization of Java Object-Oriented Programming concepts. Learn Encapsulation, Inheritance, Polymorphism, and Abstraction through interactive lessons and practice.",
  keywords: ["Java", "OOP", "Object-Oriented Programming", "Encapsulation", "Inheritance", "Polymorphism", "Abstraction", "Learn to Code"],
  authors: [{ name: "OOP Visualizer" }],
  openGraph: {
    title: "OOP Visualizer - Master Java OOP",
    description: "Interactive visualization of Java Object-Oriented Programming concepts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white overflow-x-hidden`}
      >
        <PremiumLayout>
          <div className="w-full flex justify-center">
            {children}
          </div>
        </PremiumLayout>
      </body>
    </html>
  );
}
