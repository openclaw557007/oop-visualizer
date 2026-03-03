import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Java OOP Visualizer",
  description: "Interactive visualization of Java Object-Oriented Programming concepts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-400">OOP Visualizer</a>
            <div className="flex gap-6">
              <a href="/pillars/encapsulation" className="hover:text-blue-400 transition">Encapsulation</a>
              <a href="/pillars/inheritance" className="hover:text-blue-400 transition">Inheritance</a>
              <a href="/pillars/polymorphism" className="hover:text-blue-400 transition">Polymorphism</a>
              <a href="/pillars/abstraction" className="hover:text-blue-400 transition">Abstraction</a>
              <a href="/practice" className="hover:text-green-400 transition font-medium">Practice Arena</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
