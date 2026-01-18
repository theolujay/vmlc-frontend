import { GoogleGenAI, Type } from "@google/genai";
import { QuestionData, Difficulty } from "@/types/question";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

/**
 * Formats a specific snippet of text into LaTeX.
 */
export const formatMathText = async (rawText: string): Promise<string> => {
  if (!rawText.trim()) return rawText;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: [{
          text: `You are a mathematical formatting expert. Convert the following raw text into clean text with LaTeX math notation. 
      Use $...$ for inline math and $$...$$ for block math. Fix common OCR/copy-paste errors (like x2 to x^2).
      Input: "${rawText}"
      Output only the formatted text.`
        }]
      },
      config: { temperature: 0.1 },
    });
    return response.text() || rawText;
  } catch (error) {
    console.error("Gemini formatting error:", error);
    return rawText;
  }
};

/**
 * Parses a messy block of text into a structured QuestionData object.
 */
export const parseBulkQuestion = async (bulkText: string): Promise<Partial<QuestionData>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: [{
            text: `Parse this messy text into a structured math question. 
      Identify the question text, the options (A, B, C, D), and estimated difficulty.
      Wrap all math in $...$ for inline and $$...$$ for block.
      Text: """${bulkText}"""`
        }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["label", "text"]
              }
            }
          },
          required: ["questionText", "options", "difficulty"]
        }
      }
    });

    const json = JSON.parse(response.text() || "{}");
    return {
      questionText: json.questionText,
      difficulty: json.difficulty as Difficulty,
      options: json.options.map((opt: any, index: number) => ({
        id: String(index + 1),
        label: opt.label || `Option ${String.fromCharCode(65 + index)}`,
        text: opt.text,
        type: 'Single Select'
      }))
    };
  } catch (error) {
    console.error("Bulk parse error:", error);
    throw error;
  }
};
