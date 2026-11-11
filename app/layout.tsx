import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "../components/navigation/NavBar";
import { Footer } from "../components/footer/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "السبت الممتاز | Ayad El-Moghy",
  description: "The premium digital experience for Saturday El-Momtaz hosted by Ayad El-Moghy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
