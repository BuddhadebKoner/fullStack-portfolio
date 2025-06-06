// aiService.ts
// Handles prompt building and AI orchestration for the chatbot (MCP-style)
import type { ChatContext } from './contextService';
import type { GenerateContentResult } from '../../types/gemini';

export interface AIRequest {
  message: string;
  conversationHistory?: { text: string; isUser: boolean }[];
  context: ChatContext;
}

export interface AIResponse {
  reply: string;
  raw?: string;
}

export async function getAIResponse({ message, conversationHistory = [], context }: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return { reply: 'AI unavailable. Please contact directly.' };
  }
  const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.0,
      topP: 0.1,
      topK: 1,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  // Build context string (MCP-style)
  let contextString = '';
  if (context.profile) {
    contextString += `PROFILE: ${context.profile.firstName} ${context.profile.lastName}, Email: ${context.profile.email}, Location: ${context.profile.city}, ${context.profile.country}\n`;
  }
  if (context.skills && context.skills.length > 0) {
    contextString += `SKILLS: ${context.skills.map(s => s.name + ' (' + s.level + ')').join(', ')}\n`;
  }
  if (context.projects && context.projects.length > 0) {
    contextString += `PROJECTS: ${context.projects.slice(0,3).map(p => p.title).join(', ')}\n`;
  }
  if (context.workExperience && context.workExperience.length > 0) {
    contextString += `WORK: ${context.workExperience.slice(0,2).map(w => w.position + ' at ' + w.company).join(', ')}\n`;
  }
  if (context.blogs && context.blogs.length > 0) {
    contextString += `BLOGS: ${context.blogs.slice(0,2).map(b => b.title).join(', ')}\n`;
  }

  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = conversationHistory.map(msg => (msg.isUser ? 'User: ' : 'Bot: ') + msg.text).join('\n');
  }

  const prompt = `You are Buddhadeb Koner, a full-stack developer.\nCONTEXT:\n${contextString}\n${conversationContext}\nUser: ${message}\nReply in max 50 words, direct, factual, no greetings, no assumptions, only from context.`;

  const aiTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 10000));
  const aiRequest = model.generateContent(prompt);
  const result = (await Promise.race([aiRequest, aiTimeout])) as GenerateContentResult;
  const text = (await result.response.text()).trim();
  return { reply: text, raw: text };
}
