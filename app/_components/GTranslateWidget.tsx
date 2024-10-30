"use client"; // Esto permite que el componente use useEffect

import { useEffect } from 'react';

// Extiende la interfaz Window para TypeScript
declare global {
  interface Window {
    gtranslateSettings?: {
      default_language: string;
      languages: string[];
      wrapper_selector: string;
    };
  }
}

export default function GTranslateWidget() {
  useEffect(() => {
    // Configuración del widget de GTranslate
    window.gtranslateSettings = {
      default_language: "en",
      languages: ["en", "fr", "de", "it", "es"],
      wrapper_selector: ".gtranslate_wrapper"
    };

    // Cargar el script de GTranslate
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div className="gtranslate_wrapper"></div>;
}
