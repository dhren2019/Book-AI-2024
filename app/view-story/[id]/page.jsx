"use client"
import { db } from '@/config/db'
import { StoryData } from '@/config/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip';
import BookCoverPage from '../_components/BookCoverPage'
import StoryPages from '../_components/StoryPages'
import LastPage from '../_components/LastPage'
import { Button } from '@nextui-org/button'
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosDownload, IoIosExpand, IoIosDocument } from "react-icons/io";

function ViewStory({ params }) {
  const [story, setStory] = useState();
  const bookRef = useRef();
  const [count, setCount] = useState(0);

  useEffect(() => {
    getStory();
  }, [])

  const getStory = async () => {
    const result = await db.select().from(StoryData)
      .where(eq(StoryData.storyId, params.id));
    setStory(result[0]);
  }

  return (
    <div className='p-4 md:px-10 lg:px-20 flex justify-center items-center flex-col min-h-screen'>
      <h2 className='font-bold text-3xl md:text-4xl text-center p-6 bg-primary text-white rounded-md w-full max-w-3xl'>{story?.output?.story_cover?.title}</h2>
      <div className='relative flex justify-center items-center mt-10 w-full'>
        {/* Ajuste del tamaño del libro para adaptarse a diferentes dispositivos */}
        <HTMLFlipBook 
          width={window.innerWidth < 768 ? 300 : 500} 
          height={window.innerWidth < 768 ? 400 : 500}
          maxWidth={600}
          maxHeight={700}
          showCover={true}
          className='mt-10 shadow-lg'
          useMouseEvents={false}
          ref={bookRef}
        >
          <div>
            <BookCoverPage imageUrl={story?.coverImage} />
          </div>
          {
            [...Array(story?.output?.chapters?.length)].map((item, index) => (
              <div key={index} className='bg-white p-10 border rounded-md'>
                <StoryPages storyChapter={story?.output.chapters[index]} />
              </div>
            ))
          }
        </HTMLFlipBook>
        {count != 0 && <div className='absolute left-0 md:-left-5 top-1/2 transform -translate-y-1/2'
          onClick={() => {
            bookRef.current.pageFlip().flipPrev();
            setCount(count - 1)
          }}
        >
          <IoIosArrowDropleftCircle className='text-[40px] text-primary cursor-pointer' />
        </div>}

        {count != (story?.output.chapters?.length - 1) && <div className='absolute right-0 md:-right-5 top-1/2 transform -translate-y-1/2' onClick={() => {
          bookRef.current.pageFlip().flipNext();
          setCount(count + 1)
        }}>
          <IoIosArrowDroprightCircle className='text-[40px] text-primary cursor-pointer' />
        </div>}
      </div>
      {/* Iconos adicionales debajo del libro */}
      <div className='flex justify-center items-center gap-8 mt-8'>
        <div className='flex flex-col items-center cursor-pointer'>
          <IoIosDownload className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>Descargar</span>
        </div>
        <div className='flex flex-col items-center cursor-pointer'>
          <IoIosExpand className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>Ampliar</span>
        </div>
        <div className='flex flex-col items-center cursor-pointer'>
          <IoIosDocument className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>Lerctura seguida</span>
        </div>
      </div>
    </div>
  )
}

export default ViewStory
