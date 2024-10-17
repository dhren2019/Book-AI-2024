import React, { useEffect, useState } from 'react';
import { MdPlayCircleFilled } from "react-icons/md";

function StoryPages({ storyChapter }: any) {

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Obtener las voces disponibles al cargar el componente
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;

      // Cargar voces cuando estén disponibles
      const loadVoices = () => {
        const voices = synth.getVoices();
        setAvailableVoices(voices);
      };

      // Asegurarse de que las voces estén cargadas correctamente
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
      loadVoices(); // Cargar voces si ya están disponibles
    } else {
      console.error('Speech Synthesis is not supported in this browser.');
    }
  }, []);

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window && availableVoices.length > 0) {
      const synth = window.speechSynthesis;

      // Cancelar cualquier reproducción en curso antes de empezar una nueva
      if (synth.speaking) {
        synth.cancel();
      }

      // Dividir el texto por oraciones usando un punto seguido de un espacio como delimitador
      const textChunks = splitTextBySentences(text);

      let currentChunkIndex = 0;

      const speakChunk = (chunk: string) => {
        const textToSpeech = new SpeechSynthesisUtterance(chunk);

        // Seleccionar una voz menos robótica (por ejemplo, una voz de Google si está disponible)
        const selectedVoice = availableVoices.find(voice => voice.name.includes('Google')) || availableVoices[0];
        textToSpeech.voice = selectedVoice;

        // Configurar el tono y la velocidad para hacer la voz más natural
        textToSpeech.pitch = 1;  // Rango entre 0 a 2 (1 es neutral)
        textToSpeech.rate = 1;   // Rango entre 0.1 a 10 (1 es la velocidad normal)

        // Manejar el evento de finalización para continuar con el siguiente fragmento
        textToSpeech.onend = () => {
          currentChunkIndex++;
          if (currentChunkIndex < textChunks.length) {
            speakChunk(textChunks[currentChunkIndex]);
          } else {
            console.log('Speech has finished all chunks.');
          }
        };

        // Manejar errores en la síntesis
        textToSpeech.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };

        // Empezar a hablar el fragmento de texto
        synth.speak(textToSpeech);
      };

      // Iniciar la reproducción con el primer fragmento
      speakChunk(textChunks[currentChunkIndex]);
    } else {
      console.error('Speech Synthesis is not supported in this browser or no voices are available.');
    }
  }

  // Función para dividir el texto por oraciones completas
  const splitTextBySentences = (text: string) => {
    return text.match(/[^.!?]+[.!?]+/g) || [text]; // Dividir por oraciones usando signos de puntuación
  };

  return (
    <div>
      <h2 className='text-2xl font-bold text-primary flex justify-between'>
        {storyChapter?.chapter_title}
        <span className='text-3xl cursor-pointer' onClick={() => playSpeech(storyChapter?.chapter_text)}>
          <MdPlayCircleFilled />
        </span>
      </h2>
      <p className='text-gray-900 text-lg p-10 mt-3 rounded-lg bg-slate-100'>
        {storyChapter?.chapter_text}
      </p>
    </div>
  );
}

export default StoryPages;
