// app/interactive-stories/page.tsx
"use client";
import React, { useState, useEffect } from "react";

const InteractiveStories = () => {
  const [character, setCharacter] = useState(null);
  const [story, setStory] = useState("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Llamar a la API para obtener la información del personaje y los créditos del usuario
    fetch("/api/user-data")
      .then((response) => response.json())
      .then((data) => {
        setCharacter(data.character);
        setCredits(data.credits);
      });
  }, []);

  const generateStory = async () => {
    if (credits < 2.5) {
      alert("No tienes suficientes créditos para generar una historia.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ character }),
      });
      const data = await response.json();
      setStory(data.story);
      setCredits(data.newCredits);
    } catch (error) {
      console.error("Error generando la historia:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Interactive Stories</h1>
      <p>Créditos disponibles: {credits}</p>
      <div>
      {character ? (
  <div>
    <h2 className="text-xl">Personaje: {character?.name}</h2>
    <button onClick={generateStory} disabled={loading}>
      {loading ? 'Generando...' : 'Generar nueva historia (2.5 créditos)'}
    </button>
  </div>
) : (
  <p>Cargando datos del personaje...</p>
)}

      </div>

      {story && (
        <div className="mt-4">
          <h2 className="text-xl">Historia generada:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveStories;
