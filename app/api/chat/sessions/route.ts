import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';
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

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get unique sessions with latest message
    const sessions = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          messageCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          },
          userInfo: { $last: '$metadata.userInfo' }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await ChatMessage.distinct('sessionId').then(sessions => sessions.length);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}
