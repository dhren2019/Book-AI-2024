'use client';

import { Button } from '@nextui-org/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion'; // Importar framer-motion para las animaciones

function Hero() {
  // Verificar si el componente está montado para evitar problemas de SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>✨ Create Magical AI-Powered Stories for Kids | Personalized Children's Tales ✨</title>
        <meta
          name="description"
          content="Create personalized AI-generated stories for children that ignite imagination and passion for reading. Discover fun, easy, and magical storytelling for your kids today!"
        />
      </Head>
      <div className="container mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 mt-10 min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
          {/* Texto Principal con animación */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-5 md:gap-8"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-extrabold">
                Craft Magical Stories for Kids in Minutes
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-light">
                Create fun and personalised stories that bring your child's adventures to life and spark their passion for reading. It only takes a few seconds!
              </p>
              <div className="flex flex-col md:flex-row gap-4 mt-5 md:mt-6 lg:mt-8">
                <Link href={'/create-story'}>
                  <Button
                    size="lg"
                    color="primary"
                    className="font-bold text-sm sm:text-base md:text-lg lg:text-xl py-2 sm:py-3 px-4 sm:px-6"
                  >
                    Create Story
                  </Button>
                </Link>
                <Link href={'/sign-in'}>
                  <Button
                    size="lg"
                    color="secondary"
                    className="font-bold text-sm sm:text-base md:text-lg lg:text-xl py-2 sm:py-3 px-4 sm:px-6"
                  >
                    Join
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Imagen del Hero con animación */}
          {isMounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center md:justify-end"
            >
              <Image
                src="/hero.png"
                alt="hero"
                width={500}
                height={300}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default Hero;
