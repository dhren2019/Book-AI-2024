import { Button } from '@nextui-org/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Hero() {
  return (
    <div className="container mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 mt-10 min-h-screen flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        
        {/* Texto Principal */}
        <div className="flex flex-col gap-5 md:gap-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-extrabold">
            Craft Magical Stories for Kids in Minutes
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-light">
            Create fun and personalised stories that bring your child's adventures to life and spark their passion for reading. It only takes a few seconds!
          </p>
          <Link href={'/create-story'}>
            <Button
              size="lg"
              color="primary"
              className="mt-5 md:mt-6 lg:mt-8 font-bold text-sm sm:text-base md:text-lg lg:text-xl py-2 sm:py-3 px-4 sm:px-6"
            >
              Create Story
            </Button>
          </Link>
        </div>

        {/* Imagen del Hero */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/hero.png"
            alt="hero"
            width={500}
            height={300}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
