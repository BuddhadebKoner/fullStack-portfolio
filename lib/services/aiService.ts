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
      maxOutputTokens: 200,
      temperature: 0.2,
      topP: 0.8,
      topK: 10,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  // Build comprehensive context string
  let contextString = '';
  
  if (context.profile) {
    contextString += `PROFILE: Name: ${context.profile.firstName} ${context.profile.lastName}\n`;
    contextString += `Email: ${context.profile.email}\n`;
    contextString += `Location: ${context.profile.city}, ${context.profile.country}\n`;
    if (context.profile.bio) contextString += `Bio: ${context.profile.bio}\n`;
    if (context.profile.socialLinks?.github) contextString += `GitHub: ${context.profile.socialLinks.github}\n`;
    if (context.profile.socialLinks?.linkedin) contextString += `LinkedIn: ${context.profile.socialLinks.linkedin}\n`;
  }
  
  if (context.skills && context.skills.length > 0) {
    const skillsByCategory: Record<string, string[]> = {};
    context.skills.forEach(s => {
      if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
      skillsByCategory[s.category].push(`${s.name} (${s.level})`);
    });
    
    contextString += `SKILLS:\n`;
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      contextString += `${category}: ${skills.join(', ')}\n`;
    });
  }
  
  if (context.projects && context.projects.length > 0) {
    contextString += `PROJECTS:\n`;
    context.projects.slice(0, 5).forEach((p, i) => {
      contextString += `${i + 1}. ${p.title} - ${p.desc}\n`;
      if (p.technologies?.length) contextString += `   Tech: ${p.technologies.join(', ')}\n`;
      if (p.githubUrl) contextString += `   GitHub: ${p.githubUrl}\n`;
      if (p.liveUrl) contextString += `   Live: ${p.liveUrl}\n`;
    });
  }
  
  if (context.workExperience && context.workExperience.length > 0) {
    contextString += `WORK EXPERIENCE:\n`;
    context.workExperience.slice(0, 3).forEach((w, i) => {
      const current = w.isCurrent ? ' (Current)' : '';
      contextString += `${i + 1}. ${w.position} at ${w.company}${current}\n`;
      if (w.description) contextString += `   ${w.description.substring(0, 150)}\n`;
      if (w.technologies?.length) contextString += `   Tech: ${w.technologies.join(', ')}\n`;
    });
  }
  
  if (context.blogs && context.blogs.length > 0) {
    contextString += `BLOGS:\n`;
    context.blogs.slice(0, 3).forEach((b, i) => {
      contextString += `${i + 1}. "${b.title}" - ${b.desc}\n`;
      contextString += `   URL: /blog/${b.slug}\n`;
      if (b.tags?.length) contextString += `   Tags: ${b.tags.join(', ')}\n`;
    });
  }

  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = `CONVERSATION HISTORY:\n${conversationHistory.map(msg => (msg.isUser ? 'User: ' : 'Assistant: ') + msg.text).join('\n')}\n\n`;
  }

  const prompt = `You are ${context.profile?.firstName || 'Buddhadeb'} Koner, a professional full-stack developer.

INSTRUCTIONS:
- Respond as yourself, using first person
- Be helpful, professional, and conversational
- Provide specific details from the context when relevant
- For technical questions, mention your skill level and experience
- For project questions, include links when available (GitHub: githubUrl, Live: liveUrl)
- For blog questions, provide the URL format /blog/slug
- Keep responses concise but informative (max 150 words)
- If asked about something not in your context, be honest about limitations

CONTEXT:
${contextString}

${conversationContext}User: ${message}

Respond as ${context.profile?.firstName || 'Buddhadeb'}:`;

  const aiTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 10000));
  const aiRequest = model.generateContent(prompt);
  const result = (await Promise.race([aiRequest, aiTimeout])) as GenerateContentResult;
  const text = (await result.response.text()).trim();
  return { reply: text, raw: text };
}
