import type { Metadata } from "next";
import "./globals.css";
import Provider from "./provider";
import { Nunito } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Footer from './_components/Footer';
import Head from 'next/head';
import GTranslateWidget from './_components/GTranslateWidget';



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
        <Head>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        </Head>
        <body className={MyAppFont.className}>
          <Provider>
            <GTranslateWidget /> {/* Agrega el widget aquí */}
            {children}
          </Provider>
          <Analytics />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
