import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import AdminActivity from '@/models/adminActivity.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/admin/activities - Get admin activities
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
    const actionType = searchParams.get('actionType');
    const resourceType = searchParams.get('resourceType');
    const userId_filter = searchParams.get('userId');

    // Build query
    const query: any = {};
    
    if (actionType) {
      query.actionType = actionType;
    }
    
    if (resourceType) {
      query.resourceType = resourceType;
    }
    
    if (userId_filter) {
      query.userId = userId_filter;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const activities = await AdminActivity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AdminActivity.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin activities' },
      { status: 500 }
    );
  }
}

// POST /api/admin/activities - Log admin activity
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { 
      userEmail,
      action,
      actionType,
      resourceType,
      resourceId,
      details,
      metadata
    } = body;

    // Get IP address and user agent from headers
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const activity = new AdminActivity({
      userId,
      userEmail,
      action,
      actionType,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
      metadata
    });

    await activity.save();

    return NextResponse.json({
      success: true,
      data: activity,
      message: 'Activity logged successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error logging admin activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
