
import { GoogleGenAI } from "@google/genai";

export async function generateReflection(content: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 일기 내용에 대해 짧고 시적이며 약간 신비로운 감상평을 한국어로 작성해줘. 
      2000년대 인터넷 감성(몽환적, 감성적, 사색적)을 담아야 해. 
      최대 2문장으로 작성할 것. 내용: "${content}"`,
      config: {
        temperature: 0.8,
        topP: 0.95
      }
    });

    return response.text?.trim() || "디지털 바다는 묵묵히 당신의 기억을 담아둡니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "시스템이 꿈을 꾸는 도중 오류가 발생했습니다.";
  }
}

export async function generateMoodEmoji(content: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 글의 분위기를 가장 잘 나타내는 이모지 딱 하나만 보내줘: "${content}"`
    });
    return response.text?.trim() || "☁️";
  } catch {
    return "☁️";
  }
}

export async function analyzeDream(dream: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `당신은 2000년대 초반 인터넷에서 활동하던 신비로운 몽상가이자 꿈 분석가입니다. 
      사용자가 꾼 꿈 내용을 바탕으로 그 의미를 심리학적, 그리고 약간의 초자연적인 분위기를 섞어 분석해주세요.
      말투는 친절하지만 속세를 떠난 듯한 신비로운 톤으로, 한국어로 작성해주세요.
      분석은 3-4문장 정도로 핵심만 짚어주세요.
      꿈 내용: "${dream}"`,
      config: {
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text?.trim() || "꿈의 조각이 너무 흐릿하여 분석할 수 없었습니다...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "심연의 목소리가 들리지 않습니다. 나중에 다시 시도해주세요.";
  }
}
