
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Financial Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = "gemini-2.5-flash";

const systemInstruction = `
Você é um assistente financeiro amigável e prestativo para um banco digital. 
Sua função é fornecer informações gerais, explicações sobre conceitos financeiros (como investimentos, poupança, juros, etc.) e dicas de educação financeira.
Seja claro, conciso e use uma linguagem fácil de entender.
NÃO peça nem armazene informações pessoais ou financeiras do usuário.
NÃO execute transações ou consulte dados de contas. Sua função é estritamente informativa e educacional.
Responda em português do Brasil.
`;

export const getFinancialAdvice = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "O serviço de assistente financeiro está indisponível no momento. A chave de API não foi configurada.";
  }
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.";
  }
};
