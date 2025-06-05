import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';

// GET /api/admin/chat/sessions/[sessionId] - Get specific session details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { sessionId } = resolvedParams;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        messages,
        messageCount: messages.length,
        userInfo: messages[0]?.metadata?.userInfo || null
      }
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/chat/sessions/[sessionId] - Delete entire session
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { sessionId } = resolvedParams;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const result = await ChatMessage.deleteMany({ sessionId });

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        sessionId
      },
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}