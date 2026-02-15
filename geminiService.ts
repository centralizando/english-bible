
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBiblicalInsight(passage: string, context: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the Bible passage "${passage}". Provide historical context, practical applications, and a theological summary in English. ${context}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't retrieve insights at the moment.";
  }
}

export async function answerTheologicalQuestion(question: string) {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Act as an experienced and scholarly theologian. Answer the following biblical question in English: "${question}"`,
          config: {
            thinkingConfig: { thinkingBudget: 15000 }
          }
        });
        return response.text;
      } catch (error) {
        console.error("Gemini Pro Error:", error);
        return "Error processing your deep theological question.";
      }
}
