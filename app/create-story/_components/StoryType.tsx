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
        { label: 'Excited', imageUrl: '/excited.webp', isFree: true },
        { label: 'Anxious', imageUrl: '/anxious.webp', isFree: true },
        { label: 'Relaxed', imageUrl: '/relaxed.webp', isFree: true },
        { label: 'Curious', imageUrl: '/corious.webp', isFree: true }
    ];

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

    const onUserSelect = (item: OptionField) => {
        if (item.label === 'Emotions') {
            setSelectedOption('Emotions');  // Cambiar el estado para mostrar las emociones
        } else {
            setSelectedOption(item.label);
            setSelectedEmotion(null);  // Reiniciar la emoción si selecciona otro tipo de historia
            userSelection({
                fieldValue: item.label,
                fieldName: 'storyType'
            });
        }
    }

    const onEmotionSelect = (emotion: OptionField) => {
        setSelectedEmotion(emotion.label);  // Almacenar la emoción seleccionada
        userSelection({
            fieldValue: emotion.label,
            fieldName: 'emotion'
        });
    };

    return (
        <div>
            <label className='font-bold text-4xl text-primary'>2. Story Type</label>
            {selectedOption !== 'Emotions' ? (
                <div className='grid grid-cols-3 gap-5 mt-3'>
                    {OptionList.map((item) => (
                        <div
                            key={item.label}
                            className={`relative grayscale hover:grayscale-0 cursor-pointer p-1
                            ${selectedOption === item.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale'}`}
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
                    {emotionsList.map((emotion) => (
                        <div
                            key={emotion.label}
                            className={`relative grayscale hover:grayscale-0 cursor-pointer p-1
                            ${selectedEmotion === emotion.label ? 'grayscale-0 border-2 rounded-3xl border-primary' : 'grayscale'}`}
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
    )
}

export default StoryType;
