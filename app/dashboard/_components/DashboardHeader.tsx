"use client";
import { UserDetailContext } from '@/app/_context/UserDetailConext';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';

function DashboardHeader() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div className="container mx-auto p-5 bg-primary text-white flex flex-col md:flex-row items-center gap-6 justify-between rounded-lg">
      {/* Título del Dashboard */}
      <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-center md:text-left w-full md:w-auto">
        My Stories
      </h2>
      
      {/* Información de Créditos y Botón */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end">
        <div className="flex items-center gap-2">
          <Image
            src={'/coin.png'}
            alt='coin'
            width={40}
            height={40}
            className="w-10 sm:w-12 md:w-14"
          />
          <span className="text-base sm:text-lg lg:text-xl">
            {userDetail?.credit} Credit Left
          </span>
        </div>
        
        <Link href={'/buy-credits'}>
          <Button
            className="bg-blue-500 text-white mt-4 md:mt-0 py-2 px-6 rounded-lg text-sm sm:text-base lg:text-lg font-bold"
            color="secondary"
          >
            Buy More Credits
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardHeader;
