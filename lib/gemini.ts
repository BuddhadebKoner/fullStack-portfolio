import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAIResponse(
  userMessage: string,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });

    const prompt = `You are Buddhadeb Koner's AI assistant. Provide helpful and accurate responses based on available information. Keep responses conversational and informative.

User: "${userMessage}"

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || 'Thanks for your message! Feel free to ask me anything about Buddhadeb.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I\'m having trouble responding right now. Please try again!';
  }
}

export async function generateWelcomeMessage(): Promise<string> {
  const welcomeMessages = [
    "Hi! I'm Buddhadeb's AI assistant. How can I help you today?",
    "Hello! Ask me anything about Buddhadeb's work, skills, or projects!",
    "Welcome! I'm here to help you learn more about Buddhadeb Koner.",
    "Hi there! What would you like to know about Buddhadeb?"
  ];

  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}