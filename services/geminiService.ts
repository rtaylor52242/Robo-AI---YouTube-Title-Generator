
import { GoogleGenAI, Type } from "@google/genai";

export interface TitleResponse {
  title: string;
  description: string;
  ctrScore: number;
}

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateTitles = async (idea: string, options: { tone: string; platform: string; count: number; includeEmojis: boolean; }): Promise<TitleResponse[]> => {
  const { tone, platform, count, includeEmojis } = options;

  let toneSpecificInstruction = '';
  if (tone === 'Acronym') {
    toneSpecificInstruction = `
    **Special Instruction for Acronym Tone:** The title MUST feature a relevant acronym. For example, for 'Greatest Of All Time,' a title could be 'The G.O.A.T. of...'. The acronym should be a central, clever part of the title.`;
  }

  const prompt = `
    You are an expert content strategist specializing in creating high-engagement titles. Your task is to generate compelling titles for a piece of content.

    **Content Idea:**
    "${idea}"

    **Requirements:**
    1.  **Platform:** ${platform}
    2.  **Tone:** ${tone} (The title should reflect this tone).${toneSpecificInstruction}
    3.  **Number of Titles:** Generate exactly ${count} distinct title options.
    4.  **Emojis:** ${includeEmojis ? "You MUST include one or two relevant emojis in each title." : "Do NOT include any emojis."}
    5.  **Style:** Create titles that are clear, intriguing, and informative. Avoid clickbait and hype words like "unlock," "harness," "supercharge," "ultimate," or "game-changing." The tone should be direct, helpful, and authentic.
    6.  **CTR Score:** For each title, provide an estimated Click-Through Rate (CTR) score as an integer from 1 to 100. This score should reflect its potential to attract clicks on clarity, intrigue, and relevance. A score of 100 is a perfect, must-click title.
    7.  **Description:** For each title, provide a short, one-sentence description explaining why it's a strong choice and what makes it effective.

    **Output Format:**
    Return the response as a valid JSON array of objects. Each object must have three keys: "title" (string), "description" (string), and "ctrScore" (integer).

    **Example for "making sourdough bread" idea:**
    [
      {
        "title": "A Beginner's Guide to Sourdough Bread",
        "description": "This title is clear and directly targets beginners, making it highly searchable and approachable.",
        "ctrScore": 85
      },
      {
        "title": "Simple Sourdough Bread Recipe From Scratch",
        "description": "Highlights simplicity and completeness ('From Scratch'), which appeals to users looking for an all-in-one guide.",
        "ctrScore": 90
      }
    ]
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
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The generated title for the content." },
              description: { type: Type.STRING, description: "A brief explanation of why the title is effective." },
              ctrScore: { type: Type.INTEGER, description: "An estimated CTR score from 1 to 100." }
            },
            required: ["title", "description", "ctrScore"]
          },
        },
        temperature: 0.8,
      },
    });

    const jsonString = response.text.trim();
    const titles = JSON.parse(jsonString);
    
    if (Array.isArray(titles) && titles.every(t => typeof t.title === 'string' && typeof t.description === 'string' && typeof t.ctrScore === 'number')) {
      return titles;
    } else {
      console.warn("AI returned a format that doesn't match the schema:", titles);
      // Attempt to salvage if possible, or throw
      if (Array.isArray(titles)) {
        const validTitles = titles.filter(t => typeof t.title === 'string' && typeof t.description === 'string' && typeof t.ctrScore === 'number');
        if (validTitles.length > 0) return validTitles;
      }
      throw new Error("AI returned an unexpected format. Please try again.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate titles. The AI service may be busy. Please try again later.");
  }
};