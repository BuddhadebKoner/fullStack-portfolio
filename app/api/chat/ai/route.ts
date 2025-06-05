import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';
import { generateAIResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { sessionId, message, userInfo } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Save user message
    const userMessage = new ChatMessage({
      sessionId,
      sender: 'user',
      message,
      messageType: 'text',
      metadata: {
        userInfo: {
          ...userInfo,
          ipAddress
        }
      }
    });

    await userMessage.save();

    // Get conversation history for context
    // const recentMessages = await ChatMessage.find({ sessionId })
    //   .sort({ createdAt: -1 })
    //   .limit(10)
    //   .lean();

    // Build conversation history for AI
    // const conversationHistory = recentMessages
    //   .reverse()
    //   .slice(0, -1) // Exclude the current message
    //   .map(msg => ({
    //     role: msg.sender as 'user' | 'assistant',
    //     content: msg.message
    //   }));

    // Generate AI response
    const aiResponseText = await generateAIResponse(message);

    // Save AI response
    const aiMessage = new ChatMessage({
      sessionId,
      sender: 'assistant',
      message: aiResponseText,
      messageType: 'text',
      metadata: {}
    });

    await aiMessage.save();

    return NextResponse.json({
      success: true,
      data: {
        userMessage,
        aiMessage
      },
      message: 'Chat processed successfully'
    });

  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process chat' 
      },
      { status: 500 }
    );
  }
}
