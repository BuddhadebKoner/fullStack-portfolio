import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Analytics from '@/models/analytics.model';
import { auth } from '@clerk/nextjs/server';

// Define types for analytics data
interface AnalyticsQuery {
  date?: {
    $gte: Date;
    $lte?: Date;
  };
}

interface AnalyticsBody {
  date?: string;
  pageViews?: number;
  uniqueVisitors?: number;
  totalUsers?: number;
  newUsers?: number;
  blogViews?: number;
  projectViews?: number;
  topPages?: string[];
  referrers?: string[];
  devices?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  countries?: string[];
}

// GET /api/analytics - Get analytics data
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30'; // days
    const aggregate = searchParams.get('aggregate') === 'true';

    const query: AnalyticsQuery = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last N days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      query.date = { $gte: daysAgo };
    }

    if (aggregate) {
      // Return aggregated data
      const analytics = await Analytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalPageViews: { $sum: '$pageViews' },
            totalUniqueVisitors: { $sum: '$uniqueVisitors' },
            avgTotalUsers: { $avg: '$totalUsers' },
            totalNewUsers: { $sum: '$newUsers' },
            totalBlogViews: { $sum: '$blogViews' },
            totalProjectViews: { $sum: '$projectViews' }
          }
        }
      ]);

      return NextResponse.json({
        success: true,
        data: analytics[0] || {
          totalPageViews: 0,
          totalUniqueVisitors: 0,
          avgTotalUsers: 0,
          totalNewUsers: 0,
          totalBlogViews: 0,
          totalProjectViews: 0
        }
      });
    } else {
      // Return raw data
      const analytics = await Analytics.find(query)
        .sort({ date: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        data: analytics
      });
    }

  } catch (error: unknown) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Record analytics data
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: AnalyticsBody = await request.json();
    const { 
      date = new Date().toISOString().split('T')[0],
      pageViews = 0,
      uniqueVisitors = 0,
      totalUsers = 0,
      newUsers = 0,
      blogViews = 0,
      projectViews = 0,
      topPages = [],
      referrers = [],
      devices = { mobile: 0, desktop: 0, tablet: 0 },
      countries = []
    } = body;

    const analyticsDate = new Date(date);
    
    // Update or create analytics for this date
    const analytics = await Analytics.findOneAndUpdate(
      { date: analyticsDate },
      {
        $inc: {
          pageViews,
          uniqueVisitors,
          newUsers,
          blogViews,
          projectViews
        },
        $set: {
          totalUsers,
          topPages,
          referrers,
          devices,
          countries
        }
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Analytics recorded successfully'
    });

  } catch (error: unknown) {
    console.error('Error recording analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}
