import { Textarea } from '@nextui-org/input'
import React from 'react'

function StorySubjectInput({userSelection}:any) {
  return (
    <div>
        <label className='font-bold text-4xl text-primary'>1. Subject of the story</label>
        <Textarea
        placeholder='Enter the subject of your story here.Examples: "A brave girl in a magical kingdom", "A dog who wants to fly", "The mysterious enchanted forest"'
        size='lg'
        classNames={{
            input:"resize-y min-h-[230px] text-2xl p-5"
        }}
        className='mt-3 max-w-lg'
        onChange={(e)=>userSelection({
            fieldValue:e.target.value,
            fieldName:'storySubject'
        })}
        />
    </div>
  )
}

export default StorySubjectInput