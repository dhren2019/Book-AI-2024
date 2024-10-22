"use client";
import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '../_context/UserDetailConext';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Importar las imágenes correspondientes
import CoinImage from '@/public/monedas.png';
import SackImage from '@/public/saco.png';
import Chest1Image from '@/public/cofre.png';
import Chest2Image from '@/public/cofre-2.png';

function BuyCredits() {
    const Options = [
        {
            id: 1,
            price: 1.99,
            credits: 10,
            image: CoinImage,
            stories: 10
        },
        {
            id: 2,
            price: 2.99,
            credits: 30,
            image: SackImage,
            stories: 30
        },
        {
            id: 3,
            price: 5.99,
            credits: 75,
            image: Chest1Image,
            stories: 75
        },
        {
            id: 4,
            price: 9.99,
            credits: 150,
            image: Chest2Image,
            stories: 150
        },
    ];
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null); // Cambié de 0 a null para representar cuando no se ha seleccionado nada
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const notify = (msg: string) => toast(msg);
    const notifyError = (msg: string) => toast.error(msg);

    useEffect(() => {
        if (selectedOption !== null) {
            const selected = Options.find(option => option.id === selectedOption);
            if (selected) {
                setSelectedPrice(selected.price);
            }
        }
    }, [selectedOption]);

    const OnPaymentSuccess = async () => {
        if (selectedOption !== null) {
            console.log("Inside Paypal", Options[selectedOption - 1]?.credits + userDetail?.credit);
            const result = await db.update(Users)
                .set({
                    credit: Options[selectedOption - 1]?.credits + userDetail?.credit
                }).where(eq(Users.userEmail, userDetail.userEmail));
            if (result) {
                notify("Credit is Added");
                setUserDetail((prev: any) => ({
                    ...prev,
                    ['credit']: Options[selectedOption - 1]?.credits + userDetail?.credit
                }));
                router.replace('/dashboard');
                closeModal();
            } else {
                notifyError('Server Error');
            }
        }
    };

    const openModal = () => {
        if (selectedOption !== null) {
            setModalIsOpen(true);
        } else {
            notifyError("Please select an option before proceeding");
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className='min-h-screen p-10 md:px-20 lg:px-40 text-center bg-gradient-to-b from-blue-700 to-purple-900'>
            <div className='max-w-6xl mx-auto p-5 bg-yellow-500 rounded-lg shadow-2xl mb-10'>
                <h2 className='text-6xl font-extrabold text-white tracking-wide drop-shadow-lg'>
                    Epic Treasure Awaits - Unlock Your Credits Today!
                </h2>
            </div>
            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 items-center'>
                {Options.map((option, index) => (
                    <div key={option.id} className={`relative p-10 my-5 border-4 shadow-xl text-center 
                    rounded-3xl cursor-pointer 
                    hover:scale-110 hover:rotate-3 transition-transform duration-500 ease-out 
                    hover:bg-blue-400 hover:shadow-2xl
                    ${selectedOption === option.id ? 'bg-blue-500 border-blue-700' : 'bg-blue-300 border-blue-500'}
                    `}
                        onClick={() => { setSelectedOption(option.id); openModal(); }}>
                        <img src={option.image.src} alt={`Option ${option.id}`} className='w-56 h-auto mx-auto mb-6 -mt-16 object-contain drop-shadow-2xl transform hover:translate-y-4 hover:rotate-6 transition-all duration-500' />
                        <h2 className='text-3xl font-bold text-white'>Get {option.credits} Credits</h2>
                        <h3 className='text-2xl text-yellow-200'>Generate <strong>{option.stories}</strong> Stories</h3>
                        <h2 className='font-bold text-4xl text-yellow-300 mt-2'>${option.price}</h2>
                    </div>
                ))}
            </div>

            {modalIsOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                    <div className="relative bg-gradient-to-b from-purple-900 to-blue-900 rounded-lg max-w-md mx-auto p-10 shadow-2xl transform transition-all duration-500">
                        <h2 className="text-5xl font-extrabold text-yellow-300 mb-5 drop-shadow-md">Confirm Your Purchase</h2>
                        <div className='mb-5'>
                            <h3 className='text-3xl text-yellow-100'>You are purchasing {Options[selectedOption - 1]?.credits} credits for ${selectedPrice.toFixed(2)}</h3>
                            <h3 className='text-2xl text-yellow-200'>This will allow you to generate <strong>{Options[selectedOption - 1]?.stories}</strong> stories.</h3>
                        </div>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            disabled={!selectedOption || selectedOption === 0 || selectedPrice <= 0}
                            onApprove={(data, actions) => {
                                if (actions && actions.order) {
                                    return actions.order.capture().then(() => {
                                        OnPaymentSuccess();
                                    });
                                } else {
                                    notifyError("There was an issue with the payment approval.");
                                    return Promise.reject();
                                }
                            }}
                            onCancel={() => notifyError('Payment canceled')}
                            createOrder={(data, actions) => {
                                if (selectedPrice <= 0) {
                                    notifyError("Invalid amount. Please select a valid plan.");
                                    return Promise.reject();
                                }

                                if (actions && actions.order) {
                                    return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: selectedPrice.toFixed(2),
                                                    currency_code: 'USD',
                                                },
                                            },
                                        ],
                                    });
                                } else {
                                    notifyError("Unable to create order. Please try again later.");
                                    return Promise.reject();
                                }
                            }}
                        />
                        <button onClick={closeModal} className='mt-5 px-8 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors'>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyCredits;
