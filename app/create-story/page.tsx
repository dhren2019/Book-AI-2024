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
    console.log(formData);
  };

  // Generate Story Function
  const GenerateStory = async () => {
    if (userDetail.credit <= 0) {
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
      const story = JSON.parse(result?.response.text().replace(/(})(,?)(\n *\})/g, "$1,"));

      // Generate Image
      const imageResp = await axios.post('/api/generate-image', {
        prompt: 'Add text with title: ' + story?.story_cover?.title +
          " in bold text for book cover, " + story?.story_cover?.image_prompt
      });

      const AiImageUrl = imageResp?.data?.imageUrl;

      const imageResult = await axios.post('/api/save-image', {
        url: AiImageUrl
      });

      const FirebaseStorageImageUrl = imageResult.data.imageUrl;
      const resp: any = await SaveInDB(result?.response.text(), FirebaseStorageImageUrl);
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
        output: JSON.parse(output),
        coverImage: imageUrl,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        userName: user?.fullName
      }).returning({ storyId: StoryData?.storyId });
      setLoading(false);
      return result;
    } catch (e) {
      setLoading(false);
    }
  };

  // Update User Credits in Database
  const UpdateUserCredits = async () => {
    const result = await db.update(Users).set({
      credit: Number(userDetail?.credit - 1)
    }).where(eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? ''))
      .returning({ id: Users.id });
  };

  return (
    <div className='w-full min-h-screen p-6 sm:p-10 bg-gradient-to-b from-gray-800 to-black text-white overflow-hidden'>
      <h2 className='font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-primary text-center mb-8'>
        CREATE YOUR STORY
      </h2>
      <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-primary text-center mb-10 px-4 md:px-0'>
        Unlock your creativity with AI: Craft stories like never before! Let our AI bring your imagination to life, one story at a time.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-10'>
        {/* Story Subject  */}
        <div className='flex flex-col items-center p-4 md:p-8 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full h-auto'>
          <StorySubjectInput userSelection={onHandleUserSelection} />
        </div>
        {/* Story Type  */}
        <div className='flex flex-col items-center p-4 md:p-8 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full h-auto'>
          <StoryType userSelection={onHandleUserSelection} customClass='grid grid-cols-2 gap-4 text-xs sm:text-sm md:text-base' />
        </div>
        {/* Age Group  */}
        <div className='flex flex-col items-center p-4 md:p-8 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full h-auto'>
          <AgeGroup userSelection={onHandleUserSelection} customClass='grid grid-cols-2 gap-4 text-xs sm:text-sm md:text-base' />
        </div>
        {/* Image Style  */}
        <div className='flex flex-col items-center p-4 md:p-8 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full h-auto'>
          <ImageStyle userSelection={onHandleUserSelection} customClass='grid grid-cols-2 gap-4 text-xs sm:text-sm md:text-base' />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-center items-center gap-6 mt-16 w-full'>
        <Button color='primary'
          disabled={loading}
          className='w-full sm:w-auto px-8 py-6 sm:px-12 sm:py-8 text-base sm:text-lg lg:text-xl font-bold bg-blue-500 hover:bg-blue-600 transition-colors duration-300 ease-in-out rounded-lg shadow-md hover:shadow-lg'>
          Generate Story
        </Button>
        <span className='text-sm text-primary sm:ml-4'>1 Credit will be used</span>
      </div>

      <CustomLoader isLoading={loading} />
    </div>
  );
}

export default CreateStory;
