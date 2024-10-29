"use client";
import { db } from '@/config/db';
import { StoryData } from '@/config/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import BookCoverPage from '../_components/BookCoverPage';
import StoryPages from '../_components/StoryPages';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosDownload, IoIosExpand, IoIosDocument } from "react-icons/io";

function ViewStory({ params }) {
  const [story, setStory] = useState(null);
  const bookRef = useRef();
  const flipbookContainerRef = useRef();
  const [count, setCount] = useState(0);
  const [viewMode, setViewMode] = useState('flipbook');
  const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 500 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    getStoryData();

    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        setBookDimensions({
          width: window.innerWidth < 768 ? 300 : 500,
          height: window.innerWidth < 768 ? 400 : 500,
        });
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const getStoryData = async () => {
    try {
      const result = await db.select().from(StoryData).where(eq(StoryData.storyId, params.id));
      if (result && result.length > 0) {
        const storyData = result[0];
        if (typeof storyData.output === 'string') {
          try {
            storyData.output = JSON.parse(storyData.output);
          } catch (error) {
            console.error("Error parsing story output JSON:", error);
          }
        }
        setStory(storyData);
        document.title = storyData?.output?.story_cover?.title || "Story";
      } else {
        console.warn("No story found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId: params.id }),
      });
  
      if (!response.ok) {
        throw new Error('Error generating PDF');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${story?.output?.story_cover?.title || 'story'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  

  const handleFullScreen = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setBookDimensions({
          width: 1000,
          height: 1000,
        });
      });
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        resetBookDimensions();
      }).catch((err) => {
        console.error("Error attempting to exit full-screen mode:", err.message);
      });
    }
  };

  const resetBookDimensions = () => {
    setBookDimensions({
      width: window.innerWidth < 768 ? 300 : 500,
      height: window.innerWidth < 768 ? 400 : 500,
    });
  };

  return (
    <div className={`p-4 md:px-10 lg:px-20 flex justify-center items-center flex-col min-h-screen`} style={{ userSelect: 'none' }}>
      {story ? (
        <>
          <h2 className={`font-bold text-3xl md:text-4xl text-center p-6 bg-primary text-white rounded-md w-full max-w-3xl story-title`}>
            {story.output?.story_cover?.title}
          </h2>
          <div ref={flipbookContainerRef} className={`relative flex justify-center items-center mt-10 w-full`} style={{ justifyContent: 'center' }}>
            {viewMode === 'flipbook' ? (
              <HTMLFlipBook
                width={bookDimensions.width}
                height={bookDimensions.height}
                maxWidth={600}
                maxHeight={700}
                showCover={true}
                className={`mt-10 shadow-lg`}
                useMouseEvents={false}
                ref={bookRef}
              >
                <div>
                  <BookCoverPage imageUrl={story?.coverImage} />
                </div>
                {story.output?.chapters?.map((chapter, index) => (
                  <div key={index} className={`bg-white p-10 border rounded-md story-content`}>
                    <StoryPages storyChapter={chapter} />
                  </div>
                ))}
              </HTMLFlipBook>
            ) : (
              <div className='mt-10 w-full max-w-4xl flex flex-col gap-6'>
                {story.output?.chapters?.map((chapter, index) => (
                  <div key={index} className={`bg-white p-10 border rounded-md story-content`}>
                    <StoryPages storyChapter={chapter} />
                  </div>
                ))}
              </div>
            )}
            {viewMode === 'flipbook' && count !== 0 && (
              <div className='absolute left-0 md:-left-5 top-1/2 transform -translate-y-1/2'
                onClick={() => {
                  if (bookRef.current) {
                    bookRef.current.pageFlip().flipPrev();
                  }
                  setCount(count - 1);
                }}
              >
                <IoIosArrowDropleftCircle className='text-[40px] text-primary cursor-pointer' />
              </div>
            )}
            {viewMode === 'flipbook' && count !== (story.output?.chapters?.length - 1) && (
              <div className='absolute right-0 md:-right-5 top-1/2 transform -translate-y-1/2' onClick={() => {
                if (bookRef.current) {
                  bookRef.current.pageFlip().flipNext();
                }
                setCount(count + 1);
              }}>
                <IoIosArrowDroprightCircle className='text-[40px] text-primary cursor-pointer' />
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Cargando historia...</p>
      )}
      <div className={`flex justify-center items-center gap-8 mt-8`}>
        <div className='flex flex-col items-center cursor-pointer' onClick={handleDownloadPDF}>
          <IoIosDownload className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>Descargar</span>
        </div>
        <div className='flex flex-col items-center cursor-pointer' onClick={isFullscreen ? exitFullScreen : handleFullScreen}>
          <IoIosExpand className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>{isFullscreen ? 'Salir Ampliación' : 'Ampliar'}</span>
        </div>
        <div className='flex flex-col items-center cursor-pointer' onClick={() => setViewMode(viewMode === 'flipbook' ? 'scroll' : 'flipbook')}>
          <IoIosDocument className='text-[40px] text-primary' />
          <span className='mt-2 text-primary'>Cascada</span>
        </div>
      </div>
    </div>
  );
}

export default ViewStory;