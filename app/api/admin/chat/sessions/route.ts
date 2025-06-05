import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatMessage from '@/models/chatMessage.model';

// GET /api/admin/chat/sessions - Get all chat sessions for admin
export async function GET() {
  try {
    await connectToDatabase();

    // Aggregate chat sessions by sessionId
    const sessions = await ChatMessage.aggregate([
      {
        $group: {
          _id: "$sessionId",
          messages: { $push: "$$ROOT" },
          messageCount: { $sum: 1 },
          userMessageCount: {
            $sum: { $cond: [{ $eq: ["$sender", "user"] }, 1, 0] }
          },
          lastActivity: { $max: "$createdAt" },
          lastMessage: { $last: "$$ROOT" },
          userInfo: { $first: "$metadata.userInfo" }
        }
      },
      {
        $sort: { lastActivity: -1 }
      },
      {
        $project: {
          sessionId: "$_id",
          messages: 1,
          messageCount: 1,
          userMessageCount: 1,
          lastActivity: 1,
          lastMessage: 1,
          userInfo: 1,
          _id: 0
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}