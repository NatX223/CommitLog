import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ['400', '500', '700', '800']
});

export const metadata: Metadata = {
  title: "CommitLog | Build in Public, Effortlessly",
  description: "Automate your build-in-public journey with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" 
        />
      </head>
      <body className={`${manrope.variable} font-display bg-background-light dark:bg-background-dark text-brand-text dark:text-white transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}