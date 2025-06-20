import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatSession from '@/models/chatSession.model';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sender = searchParams.get('sender') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter query for sessions
    const sessionFilter: Record<string, unknown> = {};
    
    if (search) {
      sessionFilter.$or = [
        { 'userInfo.name': { $regex: search, $options: 'i' } },
        { 'userInfo.email': { $regex: search, $options: 'i' } },
        { sessionId: { $regex: search, $options: 'i' } },
        { 'messages.message': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination

    // Fetch chat sessions with pagination
    const chatSessions = await ChatSession.find(sessionFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Flatten messages for display while maintaining session context
    const allMessages = [];
    for (const session of chatSessions) {
      for (const message of session.messages) {
        // Filter by sender if specified
        if (sender !== 'all' && message.sender !== sender) {
          continue;
        }
        
        allMessages.push({
          _id: message.id,
          sessionId: session.sessionId,
          sender: message.sender,
          message: message.message,
          messageType: 'text',
          metadata: {
            userInfo: session.userInfo
          },
          isRead: true, // ChatSession model doesn't have isRead, assume read
          createdAt: message.timestamp.toISOString(),
          updatedAt: session.updatedAt.toISOString()
        });
      }
    }

    // Sort messages by timestamp
    allMessages.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // Get session stats for analytics
    const sessionStats = await ChatSession.aggregate([
      { $match: sessionFilter },
      {
        $project: {
          sessionId: 1,
          messageCount: { $size: '$messages' },
          lastMessage: { $max: '$messages.timestamp' },
          userInfo: 1,
          createdAt: 1
        }
      },
      { $sort: { lastMessage: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        messages: allMessages.slice(0, limit), // Apply limit to messages
        pagination: {
          page,
          limit,
          total: allMessages.length,
          pages: Math.ceil(allMessages.length / limit),
          hasNext: page < Math.ceil(allMessages.length / limit),
          hasPrev: page > 1
        },
        sessionStats: sessionStats.map(stat => ({
          _id: stat.sessionId,
          messageCount: stat.messageCount,
          lastMessage: stat.lastMessage?.toISOString() || stat.createdAt.toISOString(),
          userInfo: stat.userInfo
        }))
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

// Mark sessions as active/inactive (since we don't have individual message read status)
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const { sessionIds, isActive } = await request.json();

    if (!sessionIds || !Array.isArray(sessionIds)) {
      return NextResponse.json(
        { success: false, error: 'Session IDs array is required' },
        { status: 400 }
      );
    }

    const result = await ChatSession.updateMany(
      { sessionId: { $in: sessionIds } },
      { $set: { isActive: isActive ?? true } }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error updating chat sessions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update chat sessions' },
      { status: 500 }
    );
  }
}
