import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatSession, { IChatSession } from '@/models/chatSession.model';

// GET /api/chat/messages - Get chat messages for a session
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the session
    const session = await ChatSession.findOne({ sessionId }).lean() as IChatSession | null;
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Calculate pagination for messages
    const skip = (page - 1) * limit;
    const messages = session.messages.slice(skip, skip + limit);
    const total = session.messages.length;
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Send new chat message
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      sessionId,
      sender = 'user',
      message,
    } = body;

    // Validate required fields
    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    // Get IP address from headers for user info
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Generate unique message ID
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    // Find or create session
    let session = await ChatSession.findOne({ sessionId }) as IChatSession | null;
    
    if (!session) {
      // Create new session
      session = new ChatSession({
        sessionId,
        messages: [],
        userInfo: {
          ipAddress
        },
        isActive: true
      }) as IChatSession;
    }

    // Add message to session
    session.messages.push({
      id: messageId,
      sender,
      message,
      timestamp
    });

    await session.save();

    return NextResponse.json({
      success: true,
      data: {
        id: messageId,
        sessionId,
        sender,
        message,
        timestamp
      },
      message: 'Message sent successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
