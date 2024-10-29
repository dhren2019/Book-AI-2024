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

  // Handle user input selection and add to form data
  const onHandleUserSelection = (data: fieldData) => {
    setFormData((prev: any) => ({
      ...prev,
      [data.fieldName]: data.fieldValue
    }));
    setTimeout(() => {
      console.log('Updated form data:', formData);
    }, 0);
  };

  // Generate Story Function
  const GenerateStory = async () => {
    if (!formData || Object.values(formData).some(field => !field)) {
      notifyError('Please fill in all the fields to proceed!');
      return;
    }

    if (userDetail?.credit <= 0) {
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
      // Generate AI Story
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const story = result?.response?.text();

      // Generate Image
      const imageResp = await axios.post('/api/generate-image', {
        prompt: `Add text with title: ${formData.storySubject} in bold text for book cover, ${formData.imageStyle}`
      });

      const AiImageUrl = imageResp?.data?.imageUrl;

      const imageResult = await axios.post('/api/save-image', {
        url: AiImageUrl
      });

      const FirebaseStorageImageUrl = imageResult.data.imageUrl;
      const resp: any = await SaveInDB(story, FirebaseStorageImageUrl);
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

  // Save Story Data in Database
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
        output: output,
        coverImage: imageUrl,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        userName: user?.fullName
      }).returning({ storyId: StoryData?.storyId });
      setLoading(false);
      return result;
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // Update User Credits in Database
  const UpdateUserCredits = async () => {
    try {
      await db.update(Users).set({
        credit: Number(userDetail?.credit - 1)
      }).where(eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? ''))
        .returning({ id: Users.id });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='w-full min-h-screen p-6 sm:p-10 bg-gradient-to-b from-[#5253A3] to-[#8EA4D2] text-[#FFFFFF] overflow-hidden'>
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className='font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-[#FFB84C] text-center mb-8'>
        CREATE YOUR STORY
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className='text-base sm:text-lg md:text-xl lg:text-2xl text-[#3FB4C4] text-center mb-10 px-4 md:px-0'>
        Unlock your creativity with AI: Craft stories like never before! Let our AI bring your imagination to life, one story at a time.
      </motion.p>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-10'>
        {/* Story Subject  */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className='p-4 md:p-8 bg-[#FFE5B4] rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out'>
          <StorySubjectInput userSelection={onHandleUserSelection} placeholder='Enter the subject of your story here.Examples: "A brave girl in a magical kingdom", "A dog who wants to fly", "The mysterious enchanted forest")' />
        </motion.div>
        {/* Story Type  */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className='p-4 md:p-8 bg-[#FFE5B4] rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out'>
          <StoryType userSelection={onHandleUserSelection} />
        </motion.div>
        {/* Age Group  */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4 }}
          className='p-4 md:p-8 bg-[#FFE5B4] rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out'>
          <AgeGroup userSelection={onHandleUserSelection} />
        </motion.div>
        {/* Image Style  */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6 }}
          className='p-4 md:p-8 bg-[#FFE5B4] rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out'>
          <ImageStyle userSelection={onHandleUserSelection} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8 }}
        className='flex flex-col sm:flex-row justify-center items-center gap-6 mt-16 w-full'>
        <Button color='primary'
          disabled={loading}
          onClick={GenerateStory}
          className='w-full sm:w-auto px-8 py-6 sm:px-12 sm:py-8 text-base sm:text-lg lg:text-xl font-bold bg-[#FFB84C] hover:bg-[#FF6F59] transition-colors duration-300 ease-in-out rounded-lg shadow-md hover:shadow-lg'>
          Generate Story
        </Button>
        <span className='text-sm text-[#FFFFFF] font-bold sm:ml-4'>1 Credit will be used</span>
      </motion.div>

      <CustomLoader isLoading={loading} />
    </div>
  );
}

export default CreateStory;