import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatSession from '@/models/chatSession.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/chat/sessions - Get all chat sessions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Get specific session
      const session = await ChatSession.findOne({ sessionId }).lean();
      if (!session) {
        return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: session });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get all sessions with pagination
    const sessions = await ChatSession.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Add summary information to each session
    const sessionsWithSummary = sessions.map(session => ({
      ...session,
      messageCount: session.messages.length,
      lastMessage: session.messages[session.messages.length - 1]?.message || '',
      lastMessageTime: session.messages[session.messages.length - 1]?.timestamp || session.updatedAt
    }));

    const total = await ChatSession.countDocuments();
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: sessionsWithSummary,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}
