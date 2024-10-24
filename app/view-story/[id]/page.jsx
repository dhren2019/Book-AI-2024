"use client";
import { db } from '@/config/db';
import { StoryData } from '@/config/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import BookCoverPage from '../_components/BookCoverPage';
import StoryPages from '../_components/StoryPages';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosDownload, IoIosExpand, IoIosDocument } from "react-icons/io";
import jsPDF from 'jspdf';

function ViewStory({ params }) {
  const [story, setStory] = useState(null);
  const bookRef = useRef();
  const [count, setCount] = useState(0);
  const [viewMode, setViewMode] = useState('flipbook');
  const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 500 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    getStory();

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

  const getStory = async () => {
    try {
      const result = await db.select().from(StoryData).where(eq(StoryData.storyId, params.id));
      if (result && result.length > 0) {
        const storyData = result[0];
        // Parse the output JSON field safely
        if (typeof storyData.output === 'string') {
          try {
            storyData.output = JSON.parse(storyData.output);
          } catch (error) {
            console.error("Error parsing story output JSON:", error);
          }
        }
        console.log("Fetched Story Data:", storyData); // Log the fetched story data to inspect its structure
        setStory(storyData);
        document.title = storyData?.output?.story_cover?.title || "Story";
      } else {
        console.warn("No story found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching story:", error);
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

  const handleDownloadPDF = () => {
    if (story) {
      const doc = new jsPDF({ format: 'a4' });
      const title = story.output?.story_cover?.title || "Story Title";
      console.log("Generating PDF with title:", title);
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      doc.setFontSize(12);
      
      // Extract story text and include chapters
      if (story.output?.chapters) {
        let currentY = 40;
        story.output.chapters.forEach((chapter, index) => {
          console.log(`Adding Chapter ${index + 1}:`, chapter);
          if (chapter.chapter_title) {
            doc.setFontSize(14);
            doc.text(chapter.chapter_title, 20, currentY);
            currentY += 10;
          }
          if (chapter.chapter_text) {
            const chapterLines = doc.splitTextToSize(chapter.chapter_text, 170);
            doc.setFontSize(12);
            doc.text(chapterLines, 20, currentY);
            currentY += chapterLines.length * 10 + 10;
          }

          // If the chapter has an image, add it
          if (chapter.image_prompt) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = chapter.image_prompt;
            img.onload = function() {
              console.log(`Adding image for Chapter ${index + 1}`);
              doc.addImage(img, 'JPEG', 15, currentY, 180, 100);
              currentY += 110;
            };
            img.onerror = function() {
              console.error(`Error loading image for Chapter ${index + 1}`);
            };
          }
        });
      } else {
        console.warn("No chapters found in story output.");
      }

      // Handle the cover image
      if (story.output.story_cover?.imageUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Prevent CORS issues
        img.src = story.output.story_cover.imageUrl;
        img.onload = function() {
          console.log("Image loaded successfully. Adding to PDF.");
          doc.addImage(img, 'JPEG', 15, 40, 180, 100);
          doc.save(`${title}.pdf`);
        };
        img.onerror = function() {
          console.error("Error loading cover image");
          doc.save(`${title}.pdf`);
        };
      } else {
        console.warn("No image URL found. Saving PDF without image.");
        doc.save(`${title}.pdf`);
      }
    } else {
      console.error("No story data available to generate PDF.");
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        resetBookDimensions();
        document.querySelectorAll('.story-title, .story-content').forEach(element => {
          element.style.fontSize = (parseFloat(getComputedStyle(element).fontSize) - 5) + 'px';
        });
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

  useEffect(() => {
    const canvas = document.getElementById('starfield');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const circles = [];
      const numCircles = 50;

      for (let i = 0; i < numCircles; i++) {
        circles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach((circle) => {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
          circle.x += circle.speedX;
          circle.y += circle.speedY;

          if (circle.x < 0 || circle.x > canvas.width) circle.speedX *= -1;
          if (circle.y < 0 || circle.y > canvas.height) circle.speedY *= -1;
        });
        requestAnimationFrame(animate);
      };

      animate();
    }
  }, []);

  return (
    <div className={`p-4 md:px-10 lg:px-20 flex justify-center items-center flex-col min-h-screen`} style={{ userSelect: 'none' }}>
      {/* Canvas de fondo animado */}
      <canvas id="starfield" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.3 }}></canvas>
      {story ? (
        <>
          <h2 className={`font-bold text-3xl md:text-4xl text-center p-6 bg-primary text-white rounded-md w-full max-w-3xl story-title`}>
            {story.output?.story_cover?.title}
          </h2>
          <div className={`relative flex justify-center items-center mt-10 w-full`} style={{ justifyContent: 'center' }}>
            {viewMode === 'flipbook' ? (
              // Vista de Flipbook
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
              // Vista de Lectura Seguida
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
      {/* Iconos adicionales debajo del libro */}
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
