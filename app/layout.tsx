import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./provider";
import { Nunito } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

const MyAppFont = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "✨ Create Magical AI Stories for Kids | Personalized Children's Tales ✨",
  description: "Create personalized AI-generated stories for children that ignite imagination and passion for reading. Discover fun, easy, and magical storytelling for your kids today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={MyAppFont.className}>
          <Provider>
            {children}
          </Provider>
          {/* Agrega aquí el componente Analytics */}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
