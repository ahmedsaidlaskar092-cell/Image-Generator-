import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

// Lazy initialization of the client
let aiInstance: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiInstance) {
    // Safe access to process.env to prevent ReferenceError in some browser environments
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
      ? process.env.API_KEY 
      : '';
      
    if (!apiKey) {
      console.warn("API Key is missing. AI features will fail.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

/**
 * Helper to convert a File object to a base64 string (without the data URL prefix)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:*/*;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generate an image using imagen-4.0-generate-001
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("No image generated");
    }
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw new Error(error.message || "Image generation failed");
  }
};

/**
 * Edit an image using gemini-2.5-flash-image
 */
export const editImage = async (originalImageBase64: string, imageType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: originalImageBase64,
              mimeType: imageType, 
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

    // Extract image from response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content in response");

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error: any) {
    console.error("Error editing image:", error);
    throw new Error(error.message || "Image editing failed");
  }
};

/**
 * Analyze an image using gemini-3-pro-preview
 */
export const analyzeImage = async (imageBase64: string, imageType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageType,
              data: imageBase64,
            },
          },
          {
            text: prompt || "Describe this image in detail.",
          }
        ]
      },
    });

    return response.text || "No analysis available.";
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    throw new Error(error.message || "Analysis failed");
  }
};