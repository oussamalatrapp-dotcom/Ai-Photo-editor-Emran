
import { GoogleGenAI, Modality } from "@google/genai";
import { PhotoStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMimeType = (base64: string): string | null => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : null;
};

const cleanBase64 = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, '');
};

interface EditImageParams {
  backgroundImage: string;
  itemImage?: string | null;
  itemToMove?: string;
  selectedStyle: PhotoStyle;
}

export const editImage = async ({
  backgroundImage,
  itemImage,
  itemToMove,
  selectedStyle,
}: EditImageParams): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const backgroundMimeType = getMimeType(backgroundImage);
  if (!backgroundMimeType) {
    throw new Error('Invalid background image format.');
  }

  const parts: any[] = [
    {
      inlineData: {
        data: cleanBase64(backgroundImage),
        mimeType: backgroundMimeType,
      },
    },
  ];

  let prompt: string;

  if (itemImage) {
    const itemMimeType = getMimeType(itemImage);
    if (!itemMimeType) {
      throw new Error('Invalid item image format.');
    }
    parts.push({
      inlineData: {
        data: cleanBase64(itemImage),
        mimeType: itemMimeType,
      },
    });
    prompt = `Using the first image as the main background, take the '${itemToMove || 'main subject'}' from the second image and seamlessly integrate it into the background. The final image should have a cohesive '${selectedStyle}' aesthetic, with consistent lighting, shadows, and perspective. The result must be a single, edited image.`;
  } else {
    prompt = `Transform the provided image by applying a '${selectedStyle}' style. Enhance the colors, lighting, and overall mood to fit the theme. Make the result visually stunning and high-quality. The result must be a single, edited image.`;
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const firstCandidate = response.candidates?.[0];
  if (!firstCandidate) {
    throw new Error('No content generated. Please try again.');
  }

  for (const part of firstCandidate.content.parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;
      return `data:${mimeType};base64,${data}`;
    }
  }

  throw new Error('No image was found in the API response.');
};
