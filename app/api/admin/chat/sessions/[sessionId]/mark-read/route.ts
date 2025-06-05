import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';

// PATCH /api/admin/chat/sessions/[sessionId]/mark-read - Mark all messages in session as read
export async function PATCH(
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

    // Update all messages in the session to mark as read
    const result = await ChatMessage.updateMany(
      { sessionId, sender: 'user' },
      { $set: { isRead: true } }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        sessionId
      },
      message: 'Session marked as read'
    });

  } catch (error) {
    console.error('Error marking session as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark session as read' },
      { status: 500 }
    );
  }
}