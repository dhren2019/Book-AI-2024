"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const InteractiveStories = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [story, setStory] = useState('');
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      // Simulate an API call to get user information
      fetch('/api/user-data')
        .then((response) => response.json())
        .then((data) => {
          setCharacter(data.character);
          setCredits(data.credits);
        })
        .catch((error) => console.error("Error loading user data:", error));
    }
  }, [isSignedIn]);

  const generateStory = async () => {
    if (credits < 2.5) {
      alert('You do not have enough credits to generate a story.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ character }),
      });
      const data = await response.json();
      setStory(data.story);
      setCredits(data.newCredits);
    } catch (error) {
      console.error('Error generating the story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">You need to sign in to create interactive stories.</h2>
        <Link href="/sign-in">
          <Button color="primary" className="mt-5">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary">Interactive Stories</h1>
          <p className="mt-4 text-lg text-gray-600">
            Generate personalized stories with your favorite characters and let the magic come to life.
          </p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-4">Generate New Story</h2>
          <p className="mb-4">Available Credits: {credits}</p>
          {character ? (
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Character: {character.name}</h3>
              <Button onClick={generateStory} disabled={loading} color="primary">
                {loading ? 'Generating...' : 'Generate New Story (2.5 credits)'}
              </Button>
            </div>
          ) : (
            <p>Loading character data...</p>
          )}
        </section>

        {story && (
          <Card className="mb-8">
            <CardHeader className="bg-primary text-white text-xl font-bold">
              Generated Story
            </CardHeader>
            <CardBody>
              <p>{story}</p>
            </CardBody>
          </Card>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Previous Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Here you could map a list of previous user stories */}
            {[1, 2, 3].map((index) => (
              <Card key={`story-${index}`} className="shadow-md">
                <CardHeader className="bg-secondary text-white text-lg font-semibold">
                  Story #{index}
                </CardHeader>
                <CardBody>
                  <p>
                    An exciting past story you generated. Click to read more!
                  </p>
                  <Link href={`/create-story/interactive-stories/story-${index}`}>
                    <Button color="secondary" className="mt-4">
                      Read Full Story
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InteractiveStories;
