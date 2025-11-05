
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateTitles = async (idea: string): Promise<string[]> => {
  const prompt = `
    You are an expert YouTube title creator. Your goal is to create compelling, clear, and informative video titles.
    Please do not use hype-oriented words like "unlock", "harness", "supercharge", "ultimate", "game-changing", or other similar marketing buzzwords. The tone should be direct, helpful, and authentic.

    Here are some examples of good titles for a video about "making sourdough bread":
    - A Beginner's Guide to Sourdough Bread
    - How to Make Sourdough Bread From Scratch
    - Simple Sourdough Bread Recipe
    - Troubleshooting Common Sourdough Problems
    - The Science Behind a Sourdough Starter

    Based on the user's video idea below, generate 5 distinct title options that follow these principles.

    User's Idea: "${idea}"

    Return the response as a JSON array of 5 strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A YouTube video title.",
          },
        },
        temperature: 0.8,
      },
    });

    const jsonString = response.text.trim();
    const titles = JSON.parse(jsonString);

    if (Array.isArray(titles) && titles.every(t => typeof t === 'string')) {
      return titles;
    } else {
      throw new Error("AI returned an unexpected format. Please try again.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate titles. The AI service may be busy. Please try again later.");
  }
};
