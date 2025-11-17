
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { ImageAnalysisResult, TextAnalysisResult } from '../types';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

// Only log warning in development mode
if (!API_KEY && (import.meta.env.DEV || window.location.hostname === 'localhost')) {
  console.info("ℹ️ API_KEY not set. AI features (image analysis, text moderation) will be disabled.");
}

// Lazy initialization - only create AI instance when needed and API key is available
let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!API_KEY) {
    throw new Error("An API Key must be set when running in a browser");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeImageSafety = async (base64Image: string, mimeType: string): Promise<ImageAnalysisResult> => {
  if (!API_KEY) throw new Error("API Key is not configured.");
  try {
    const aiInstance = getAI();
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          fileToGenerativePart(base64Image, mimeType),
          { text: "Analizza questa immagine per un sito di annunci. Rispondi SOLO in formato JSON. Il JSON deve avere: un booleano 'safe' (true se l'immagine è adatta a tutti, false altrimenti), un array di stringhe 'tags' con etichette come 'violence', 'adult_content', 'medical', 'spoof' se presenti, e una stringa 'description' di massimo 15 parole." }
        ],
      },
       config: {
         responseMimeType: "application/json",
       },
    });

    const jsonText = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image with AI.");
  }
};

export const analyzeAdText = async (title: string, description: string): Promise<TextAnalysisResult> => {
  if (!API_KEY) throw new Error("API Key is not configured.");
  try {
    const aiInstance = getAI();
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: `Analizza il testo di questo annuncio per un sito di e-commerce. Titolo: "${title}". Descrizione: "${description}". Rispondi SOLO in formato JSON. Il JSON deve avere: un booleano 'safe' (true se il testo rispetta le policy e non è sospetto, false altrimenti), un array di stringhe 'tags' con etichette per eventuali problemi (es: 'prohibited_item', 'potential_scam', 'offensive_language', 'unclear_description'), e una stringa 'reason' con una breve motivazione in 15 parole.` }
        ],
      },
       config: {
         responseMimeType: "application/json",
       },
    });

    const jsonText = response.text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw new Error("Failed to analyze text with AI.");
  }
};


const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    if (!API_KEY) throw new Error("API Key is not configured.");
    try {
         const aiInstance = getAI();
         const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data returned from AI.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image with AI.");
    }
};

export const censorImageFaces = (base64Image: string, mimeType: string): Promise<string> => {
  const prompt = "Modifica questa immagine. Trova tutti i volti umani e coprili con una forte sfocatura o pixelizzazione per proteggere la privacy. Non modificare nient'altro nell'immagine.";
  return editImage(base64Image, mimeType, prompt);
};


export const watermarkImage = (base64Image: string, mimeType: string): Promise<string> => {
  const prompt = "Modifica questa immagine. Aggiungi un watermark semi-trasparente con il testo 'Presto.it' nell'angolo in basso a destra. Il testo del watermark deve essere bianco con una leggera ombra per la visibilità.";
  return editImage(base64Image, mimeType, prompt);
};
