import { GoogleGenAI, Type } from "@google/genai";
import { Artist } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const artistSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The official name of the artist or band." },
        genre: { type: Type.STRING, description: "The primary genre of the artist." },
        description: { type: Type.STRING, description: "A brief 2-3 sentence biography of the artist." },
        officialWebsite: { type: Type.STRING, description: "The official homepage URL for the artist. If not found, return an empty string." }
    },
    required: ["name", "genre", "description", "officialWebsite"]
};

export const searchArtist = async (query: string): Promise<Artist> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find information for the artist: "${query}". Provide their official name, genre, a short description, and their official website URL.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: artistSchema,
            },
        });

        const text = response.text;

        // 🛠️ undefinedチェックを追加
        if (!text) {
            throw new Error("Received empty response from API.");
        }

        const parsedJson = JSON.parse(text);
        return parsedJson as Artist;

    } catch (error) {
        console.error("Error searching for artist:", error);
        throw new Error("Failed to fetch artist data. Please check the console for details.");
    }
};
