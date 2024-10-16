"use client"
import Image from 'next/image'
import React, { useState } from 'react'

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
            label: 'Emotions',  // Nueva opción
            imageUrl: '/emotions.webp',  // Añadir una imagen representativa para esta opción
            isFree: true
        },
    ]

    const emotionsList = [
        { label: 'Happy', imageUrl: '/happy.webp', isFree: true },
        { label: 'Sad', imageUrl: '/sad.webp', isFree: true },
        { label: 'Excited', imageUrl: '/excited.png', isFree: true },
        { label: 'Anxious', imageUrl: '/anxious.png', isFree: true },
        { label: 'Relaxed', imageUrl: '/relaxed.png', isFree: true },
        { label: 'Curious', imageUrl: '/curious.png', isFree: true }
    ];

    const [selectedOption, setSelectedOption] = useState<string>();
    const [showEmotions, setShowEmotions] = useState<boolean>(false);

    const onUserSelect = (item: OptionField) => {
        if (item.label === 'Emotions') {
            setShowEmotions(true);  // Mostrar la lista de emociones
        } else {
            setSelectedOption(item.label);
            userSelection({
                fieldValue: item?.label,
                fieldName: 'storyType'
            });
        }
    }

    const onEmotionSelect = (emotion: OptionField) => {
        setSelectedOption(emotion.label);
        userSelection({
            fieldValue: emotion?.label,
            fieldName: 'emotion'
        });
    };

    return (
        <div>
            <label className='font-bold text-4xl text-primary'>2. Story Type</label>
            {!showEmotions ? (
                <div className='grid grid-cols-3 gap-5 mt-3'>
                    {OptionList.map((item, index) => (
                        <div
                            key={index}
                            className={`relative grayscale hover:grayscale-0 cursor-pointer p-1
                            ${selectedOption === item.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale'}
                        `}
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
            ) : (
                <div className='grid grid-cols-3 gap-5 mt-3'>
                    {emotionsList.map((emotion, index) => (
                        <div
                            key={index}
                            className={`relative grayscale hover:grayscale-0 cursor-pointer p-1
                            ${selectedOption === emotion.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale'}
                        `}
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
            )}
        </div>
    )
}

export default StoryType;
