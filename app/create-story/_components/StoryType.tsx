"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export interface OptionField {
    label: string,
    imageUrl: string,
    isFree: boolean
}

function StoryType({ userSelection }: any) {
    const OptionList = [
        {
            label: 'Story Book',
            imageUrl: '/story.png',
            isFree: true
        },
        {
            label: 'Bed Story',
            imageUrl: '/bedstory.png',
            isFree: true
        },
        {
            label: 'Educational',
            imageUrl: '/educational.png',
            isFree: true
        },
        {
            label: 'Emotions',
            imageUrl: '/emotions.webp',
            isFree: true
        },
    ];

    const emotionsList = [
        { label: 'Happy', imageUrl: '/happy.webp', isFree: true },
        { label: 'Sad', imageUrl: '/sad.webp', isFree: true },
        { label: 'Excited', imageUrl: '/excited.webp', isFree: true },
        { label: 'Anxious', imageUrl: '/anxious.webp', isFree: true },
        { label: 'Relaxed', imageUrl: '/relaxed.webp', isFree: true },
        { label: 'Curious', imageUrl: '/curious.webp', isFree: true }
    ];

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [showIndicator, setShowIndicator] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIndicator(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    const onUserSelect = (item: OptionField) => {
        if (item.label === 'Emotions') {
            setSelectedOption('Emotions');
        } else {
            setSelectedOption(item.label);
            setSelectedEmotion(null);
            userSelection({
                fieldValue: item.label,
                fieldName: 'storyType'
            });
        }
    };

    const onEmotionSelect = (emotion: OptionField) => {
        setSelectedEmotion(emotion.label);
        userSelection({
            fieldValue: emotion.label,
            fieldName: 'emotion'
        });
    };

    return (
        <div>
            <label className='font-bold text-4xl text-primary'>2. Story Type</label>
            {selectedOption !== 'Emotions' ? (
                <div className='mt-3 py-4 px-2'>
                    <div className='hidden sm:grid grid-cols-3 gap-5'>
                        {OptionList.map((item) => (
                            <div
                                key={item.label}
                                className={`relative cursor-pointer p-1
                                ${selectedOption === item.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale hover:grayscale-0'}`}
                                onClick={() => onUserSelect(item)}
                            >
                                <h2 className='absolute bottom-5 text-2xl text-white text-center w-full'>{item.label}</h2>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.label}
                                    width={300}
                                    height={500}
                                    className='object-cover h-[260px] rounded-3xl'
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex sm:hidden overflow-x-auto space-x-4 scrollbar-hide relative'>
                        {OptionList.map((item, index) => (
                            <div
                                key={item.label}
                                className={`relative flex-shrink-0 cursor-pointer p-1 w-[300px]
                                ${selectedOption === item.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale hover:grayscale-0'}`}
                                onClick={() => onUserSelect(item)}
                            >
                                <h2 className='absolute bottom-5 text-2xl text-white text-center w-full'>{item.label}</h2>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.label}
                                    width={300}
                                    height={500}
                                    className='object-cover h-[260px] rounded-3xl'
                                />
                            </div>
                        ))}
                        {showIndicator && (
                            <div className='absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none animate-bounce'>
                                <div className='flex items-center justify-center w-12 h-12 bg-primary rounded-full opacity-90 transition-transform transform hover:scale-150'>
                                    <FaArrowRight className='text-white text-2xl' />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='mt-3 py-4 px-2'>
                    <div className='hidden sm:grid grid-cols-3 gap-5'>
                        {emotionsList.map((emotion) => (
                            <div
                                key={emotion.label}
                                className={`relative cursor-pointer p-1
                                ${selectedEmotion === emotion.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale hover:grayscale-0'}`}
                                onClick={() => onEmotionSelect(emotion)}
                            >
                                <h2 className='absolute bottom-5 text-2xl text-white text-center w-full'>{emotion.label}</h2>
                                <Image
                                    src={emotion.imageUrl}
                                    alt={emotion.label}
                                    width={300}
                                    height={500}
                                    className='object-cover h-[260px] rounded-3xl'
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex sm:hidden overflow-x-auto space-x-4 scrollbar-hide relative'>
                        {emotionsList.map((emotion, index) => (
                            <div
                                key={emotion.label}
                                className={`relative flex-shrink-0 cursor-pointer p-1 w-[300px]
                                ${selectedEmotion === emotion.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale hover:grayscale-0'}`}
                                onClick={() => onEmotionSelect(emotion)}
                            >
                                <h2 className='absolute bottom-5 text-2xl text-white text-center w-full'>{emotion.label}</h2>
                                <Image
                                    src={emotion.imageUrl}
                                    alt={emotion.label}
                                    width={300}
                                    height={500}
                                    className='object-cover h-[260px] rounded-3xl'
                                />
                            </div>
                        ))}
                        {showIndicator && (
                            <div className='absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none animate-bounce'>
                                <div className='flex items-center justify-center w-12 h-12 bg-primary rounded-full opacity-90 transition-transform transform hover:scale-150'>
                                    <FaArrowRight className='text-white text-2xl' />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedOption === 'Emotions' && (
                <div className='flex justify-end mt-5'>
                    <button
                        onClick={() => setSelectedOption(null)}
                        className='text-primary underline cursor-pointer'
                    >
                        Back to Story Types
                    </button>
                </div>
            )}
        </div>
    );
}

export default StoryType;