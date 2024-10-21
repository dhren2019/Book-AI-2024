"use client";
import { NextUIProvider } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import Header from './_components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from './_context/UserDetailConext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Asegúrate de que la ruta sea correcta

function Provider({ children }: { children: React.ReactNode }) {
  const [userDetail, setUserDetail] = useState<any>();
  const { user } = useUser();

  useEffect(() => {
    user && saveNewUserIfNotExist();
  }, [user]);

  const saveNewUserIfNotExist = async () => {
    const userResp = await db.select().from(Users)
      .where(eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? ''));

    if (!userResp[0]) {
      const result = await db.insert(Users).values({
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        userName: user?.fullName
      }).returning({
        userEmail: Users.userEmail,
        userName: Users.userName,
        userImage: Users.userImage,
        credit: Users.credit
      });
      setUserDetail(result[0]);
    } else {
      setUserDetail(userResp[0]);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    console.log(`Idioma cambiado a: ${lang}`); // Log para verificar si se está ejecutando
  };
  

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '' }}>
        <NextUIProvider>
        <I18nextProvider i18n={i18n}>
  <Header onChangeLanguage={changeLanguage} />
  {children}
            <ToastContainer />
          </I18nextProvider>
        </NextUIProvider>
      </PayPalScriptProvider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
