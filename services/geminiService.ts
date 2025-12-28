
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFirmwareCode = async (code: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following embedded firmware snippet for potential timing issues, race conditions, or configuration errors in GPIO/UART/SPI interfaces:\n\n${code}`,
    config: {
      temperature: 0.2,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text;
};

export const getProtocolAdvisor = async (query: string, history: { role: string, content: string }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert embedded firmware engineer specializing in communication protocols (SPI, UART, I2C, ADC, GPIO). Help the user debug timing-sensitive code and hardware interface problems. Provide concise, technical advice.',
    },
  });

  const response = await chat.sendMessage({ message: query });
  return response.text;
};
