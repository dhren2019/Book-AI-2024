"use client";
import React, { useContext, useState } from 'react';
import StorySubjectInput from './_components/StorySubjectInput';
import StoryType from './_components/StoryType';
import AgeGroup from './_components/AgeGroup';
import ImageStyle from './_components/ImageStyle';
import { Button } from '@nextui-org/button';
import { chatSession } from '@/config/GeminiAi';
import { db } from '@/config/db';
import { StoryData, Users } from '@/config/schema';
//@ts-ignore
import uuid4 from "uuid4";
import CustomLoader from './_components/CustomLoader';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '../_context/UserDetailConext';
import { eq } from 'drizzle-orm';
import { motion } from 'framer-motion';

const CREATE_STORY_PROMPT = process.env.NEXT_PUBLIC_CREATE_STORY_PROMPT;

export interface fieldData {
  fieldName: string;
  fieldValue: string;
}

export interface formDataType {
  storySubject: string;
  storyType: string;
  imageStyle: string;
  ageGroup: string;
  emotion: string; // Emotions
}

function CreateStory() {
  const [formData, setFormData] = useState<formDataType>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const notify = (msg: string) => toast(msg);
  const notifyError = (msg: string) => toast.error(msg);
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const onHandleUserSelection = (data: fieldData) => {
    setFormData((prev: any) => ({
      ...prev,
      [data.fieldName]: data.fieldValue,
    }));
    console.log(formData);
  };

  const GenerateStory = async () => {
    if (!userDetail || userDetail.credit <= 0) {
      notifyError('You dont have enough credits!');
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = CREATE_STORY_PROMPT
      ?.replace('{ageGroup}', formData?.ageGroup ?? '')
      .replace('{storyType}', formData?.storyType ?? '')
      .replace('{emotion}', formData?.emotion ?? '')
      .replace('{storySubject}', formData?.storySubject ?? '')
      .replace('{imageStyle}', formData?.imageStyle ?? '');

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const storyResponse = result?.response?.text();

      if (!storyResponse || !isValidJSON(storyResponse)) {
        throw new Error('Invalid JSON response from AI');
      }

      const story = JSON.parse(storyResponse);

      const imageResp = await axios.post('/api/generate-image', {
        prompt: 'Add text with title:' + story?.story_cover?.title +
          " in bold text for book cover, " + story?.story_cover?.image_prompt,
      });

      const AiImageUrl = imageResp?.data?.imageUrl;

      const imageResult = await axios.post('/api/save-image', {
        url: AiImageUrl,
      });

      const FirebaseStorageImageUrl = imageResult.data.imageUrl;
      const resp: any = await SaveInDB(storyResponse, FirebaseStorageImageUrl);
      notify("Story generated");
      await UpdateUserCredits();
      router?.replace('/view-story/' + resp[0].storyId);
      setLoading(false);
    } catch (e) {
      console.log(e);
      notifyError('Server Error, Try again');
      setLoading(false);
    }
  };

  const isValidJSON = (text: string) => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const SaveInDB = async (output: string, imageUrl: string) => {
    const recordId = uuid4();
    setLoading(true);
    try {
      const result = await db.insert(StoryData).values({
        storyId: recordId,
        ageGroup: formData?.ageGroup,
        imageStyle: formData?.imageStyle,
        storySubject: formData?.storySubject,
        storyType: formData?.storyType,
        output: JSON.parse(output),
        coverImage: imageUrl,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        userName: user?.fullName,
      }).returning({ storyId: StoryData?.storyId });
      setLoading(false);
      return result;
    } catch (e) {
      setLoading(false);
    }
  };

  const UpdateUserCredits = async () => {
    if (userDetail) {
      await db.update(Users).set({
        credit: Number(userDetail?.credit - 1),
      }).where(eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? ''))
        .returning({ id: Users.id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 lg:px-24 bg-gradient-to-br from-[#FFE3C9] to-[#FFB9C5] relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-[#FF8A65] opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFD54F] opacity-40 blur-2xl"></div>

      {/* Título y Subtítulo */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-center items-center gap-4">
          <h2 className="text-5xl font-extrabold text-[#6A1B9A]">Create Your Story</h2>
          <img src="explore.gif" alt="Explore" className="w-40 h-40" />
        </div>
        <p className="text-2xl text-[#5D4037] mt-4">
          Unlock your creativity with AI: Craft stories like never before! Let our AI bring your imagination to life, one story at a time.
        </p>
      </motion.div>

      {/* Inputs de Selección */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Story Subject */}
        <motion.div
          className="bg-white bg-opacity-50 rounded-[40px] p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img src="globe.png" alt="Story Subject Icon" className="w-20 h-20" />
            <h3 className="text-3xl font-bold text-[#5253A3]">Story Subject</h3>
          </div>
          <StorySubjectInput
            userSelection={onHandleUserSelection}
            placeholder="Enter your story subject"
            inputClassName="bg-transparent border-0 focus:outline-none text-[#000]"
          />
        </motion.div>

        {/* Story Type */}
        <motion.div
          className="bg-white bg-opacity-50 rounded-[40px] p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img src="subject.png" alt="Story Type Icon" className="w-20 h-20" />
            <h3 className="text-3xl font-bold text-[#5253A3]">Story Type</h3>
          </div>
          <StoryType
            userSelection={onHandleUserSelection}
            inputClassName="bg-transparent border-0 focus:outline-none text-[#000]"
          />
        </motion.div>

        {/* Age Group */}
        <motion.div
          className="bg-white bg-opacity-50 rounded-[40px] p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img src="king.png" alt="Age Group Icon" className="w-20 h-20" />
            <h3 className="text-3xl font-bold text-[#5253A3]">Age Group</h3>
          </div>
          <AgeGroup
            userSelection={onHandleUserSelection}
            inputClassName="bg-transparent border-0 focus:outline-none text-[#000]"
          />
        </motion.div>

        {/* Image Style */}
        <motion.div
          className="bg-white bg-opacity-50 rounded-[40px] p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img src="book.png" alt="Image Style Icon" className="w-20 h-20" />
            <h3 className="text-3xl font-bold text-[#5253A3]">Image Style</h3>
          </div>
          <ImageStyle
            userSelection={onHandleUserSelection}
            inputClassName="bg-transparent border-0 focus:outline-none text-[#000]"
          />
        </motion.div>
      </div>

      {/* Botón para Generar Historia */}
      <motion.div
        className="mt-16 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Button
          color="primary"
          disabled={loading}
          onClick={GenerateStory}
          className="w-full text-white font-semibold py-6 rounded-full shadow-xl hover:shadow-2xl transition-transform hover:scale-105 duration-300 bg-gradient-to-r from-[#FFAA4C] to-[#FF6F59]"
        >
          Generate Story
        </Button>
        <p className="text-center text-gray-700 mt-4">1 Credit will be used</p>
      </motion.div>

      <CustomLoader isLoading={loading} />
    </div>
  );
}

export default CreateStory;
