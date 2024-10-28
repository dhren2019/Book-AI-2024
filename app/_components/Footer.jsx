import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/logo.svg';

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#5253A3] to-blue-700 text-white py-10">
      <div className="container mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-start">
        {/* Columna Izquierda: Logo y Descripción */}
        <div className="flex flex-col items-start text-left text-left">
          <Image src={Logo} alt="StelarBooks AI Logo" width={80} height={80} className="mb-4 ml-0" />
          <p className="text-lg font-light">
            StelarBooks AI: Create magical AI-powered stories for children, making reading fun and personalized for every kid.
          </p>
        </div>

        {/* Columna del Medio: Legal */}
        <div className="flex flex-col items-center text-left self-start">
          <h3 className="text-2xl font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/legal/privacy-policy" className="hover:text-yellow-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="hover:text-yellow-300 transition-colors">
                Cookies Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/legal-notice" className="hover:text-yellow-300 transition-colors">
                Legal Notice
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna Derecha: Páginas Principales */}
        <div className="flex flex-col items-center text-left">
          <h3 className="text-2xl font-bold mb-4">Main Pages</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-yellow-300 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/create-story" className="hover:text-yellow-300 transition-colors">
                Create Story
              </Link>
            </li>
            <li>
              <Link href="/explore-stories" className="hover:text-yellow-300 transition-colors">
                Explore Stories
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-yellow-300 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center border-t border-white pt-5">
        <p className="text-sm font-light">
          &copy; {new Date().getFullYear()} StelarBooks AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
