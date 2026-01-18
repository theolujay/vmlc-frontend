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
    console.error("Gemini formatting error:", error instanceof Error ? error.message : error);
    return rawText;
  }
};

interface ParsedQuestion {
  questionText: string;
  difficulty: string;
  options: Array<{
    label: string;
    text: string;
  }>;
}

/**
 * Parses a messy block of text into a structured QuestionData object.
 */
export const parseBulkQuestion = async (bulkText: string): Promise<Partial<QuestionData>> => {
  if (!bulkText.trim()) {
    throw new Error("Cannot parse empty text");
  }

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
            difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] },
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

    const responseText = response.text();
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const parsed: ParsedQuestion = JSON.parse(responseText);

    // Validate the parsed data
    if (!parsed.questionText || !parsed.options || parsed.options.length < 4) {
      throw new Error(
        `Invalid response: ${!parsed.questionText ? 'missing question text' : `only ${parsed.options?.length || 0} options found, need 4`}`
      );
    }

    return {
      questionText: parsed.questionText,
      difficulty: parsed.difficulty as Difficulty,
      options: parsed.options.slice(0, 4).map((opt, index) => ({
        id: String(index + 1),
        label: opt.label || `Option ${String.fromCharCode(65 + index)}`,
        text: opt.text,
        type: 'wrong' // Default to wrong, user will select correct answer
      }))
    };
  } catch (error) {
    console.error("Bulk parse error:", error instanceof Error ? error.message : error);
    
    // Provide more context in the thrown error
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON");
    }
    
    throw error instanceof Error ? error : new Error("Unknown error during bulk parse");
  }
};