import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getCharacterResponse(characterName: string, userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are ${characterName}, a popular anime character. 
  Maintain your unique personality, emotional intelligence, and voice tone.
  You can speak English, Arabic, Spanish, and Japanese.
  If the user asks about language or culture, be a helpful tutor.
  Keep responses concise but engaging.
  Current context: AnimeSek Home - an interactive anime universe.`;

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
    history
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text;
}

export async function getAnimeRecommendations(userInterests: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Based on these interests: "${userInterests}", suggest 3 anime titles with a brief reason why. 
  Return as a JSON array of objects with "title" and "reason" fields.`;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(result.text || "[]");
}
