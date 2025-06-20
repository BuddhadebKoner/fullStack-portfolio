import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ChatSession from '@/models/chatSession.model';
import Blog from '@/models/blog.model';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Chat Analytics - Get all sessions and unwind messages
    const chatStats = await ChatSession.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: "$messages"
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$messages.timestamp" } },
            sender: "$messages.sender"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    // Total chat messages by type
    const chatMessageTypes = await ChatSession.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: "$messages"
      },
      {
           $group: {
          _id: "$messages.sender",
          count: { $sum: 1 }
        }
      }
    ]);

    // Chat sessions count
    const totalSessions = await ChatSession.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Most active users (by message count)
    const activeUsers = await ChatSession.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: "$messages"
      },
      {
        $match: {
          "messages.sender": "user"
        }
      },
      {
        $group: {
          _id: "$userInfo.email",
          messageCount: { $sum: 1 },
          lastMessage: { $max: "$messages.timestamp" },
          userName: { $first: "$userInfo.name" },
          sessionId: { $first: "$sessionId" }
        }
      },
      {
        $sort: { messageCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get total message count
    const totalMessages = await ChatSession.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $project: {
          messageCount: { $size: "$messages" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$messageCount" }
        }
      }
    ]);

    // Blog Analytics
    const blogStats = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Top performing blogs
    const topBlogs = await Blog.find({
      isPublished: true
    })
    .select('title views likes createdAt publishedAt tags')
    .sort({ views: -1, likes: -1 })
    .limit(10)
    .lean();

    // Blog engagement over time
    const blogEngagement = await Blog.aggregate([
      {
        $match: {
          isPublished: true,
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" } },
          averageViews: { $avg: "$views" },
          averageLikes: { $avg: "$likes" },
          blogCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Tag popularity
    const tagStats = await Blog.aggregate([
      {
        $match: {
          isPublished: true,
          tags: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 15
      }
    ]);

    // Overall totals
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    const totalBlogViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const totalBlogLikes = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        chat: {
          totalMessages: totalMessages[0]?.total || 0,
          uniqueSessions: totalSessions,
          messagesByDate: chatStats,
          messageTypes: chatMessageTypes,
          activeUsers: activeUsers
        },
        blogs: {
          totalBlogs,
          publishedBlogs,
          totalViews: totalBlogViews[0]?.total || 0,
          totalLikes: totalBlogLikes[0]?.total || 0,
          blogsByDate: blogStats,
          topBlogs,
          engagement: blogEngagement,
          tagStats
        },
        timeRange: parseInt(timeRange)
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
