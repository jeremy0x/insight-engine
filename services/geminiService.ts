import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Role, SYSTEM_INSTRUCTION } from '../types';

// Initialize the Gemini API client
// We use a getter to ensure we grab the latest key if it changes (though usually env is static)
// and to avoid issues if the key is missing initially in some envs (though mandated by prompt to assume valid)
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateResponse = async (
  history: Message[],
  prompt: string,
  image: string | null,
  enableThinking: boolean
): Promise<string> => {
  const ai = getAiClient();

  // Convert internal Message history to Gemini API Content format
  const contents: Content[] = history.map((msg) => {
    const parts: Part[] = [];
    
    // If the message has an image, we must attach it.
    // Note: The API expects images to be InlineData.
    if (msg.image) {
       // Extract base64 data (remove "data:image/png;base64," prefix if present)
       const base64Data = msg.image.split(',')[1] || msg.image;
       // We'll assume the MIME type is png or jpeg based on the prefix or default to png
       const mimeMatch = msg.image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
       const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
       
       parts.push({
         inlineData: {
           mimeType: mimeType,
           data: base64Data
         }
       });
    }

    if (msg.text) {
      parts.push({ text: msg.text });
    }

    return {
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: parts
    };
  });

  // Add the current user message
  const currentParts: Part[] = [];
  if (image) {
      const base64Data = image.split(',')[1] || image;
      const mimeMatch = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      currentParts.push({
        inlineData: {
            mimeType,
            data: base64Data
        }
      });
  }
  currentParts.push({ text: prompt });
  
  contents.push({
    role: 'user',
    parts: currentParts
  });

  // Configuration
  // We use gemini-3-pro-preview for high reasoning and thinking capabilities
  const modelName = 'gemini-3-pro-preview';
  
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  // Enable Thinking Mode if requested
  if (enableThinking) {
    config.thinkingConfig = {
      thinkingBudget: 32768, // Max budget for gemini-3-pro
    };
    // Explicitly do not set maxOutputTokens when using thinkingBudget for this requirement,
    // or set it very high if needed, but the prompt says "Do not set maxOutputTokens".
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
