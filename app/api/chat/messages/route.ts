import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';

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

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ChatMessage.countDocuments({ sessionId });
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

  } catch {
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
      messageType = 'text',
      metadata = {}
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

    // Add IP to metadata if it's a user message
    if (sender === 'user' && metadata.userInfo) {
      metadata.userInfo.ipAddress = ipAddress;
    }

    const chatMessage = new ChatMessage({
      sessionId,
      sender,
      message,
      messageType,
      metadata
    });

    await chatMessage.save();

    return NextResponse.json({
      success: true,
      data: chatMessage,
      message: 'Message sent successfully'
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
