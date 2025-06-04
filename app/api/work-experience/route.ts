import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkExperience from '@/models/workExperience.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/work-experience - Get all work experiences
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const visible = searchParams.get('visible');
    const sort = searchParams.get('sort') || '-startDate';

    // Build query
    const query: {
      isVisible?: boolean;
    } = {};
    
    if (visible !== null) {
      query.isVisible = visible !== 'false';
    }

    // Execute query
    const experiences = await WorkExperience.find(query)
      .sort(sort)
      .lean();

    return NextResponse.json({
      success: true,
      data: experiences
    });

  } catch{
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work experiences' },
      { status: 500 }
    );
  }
}

// POST /api/work-experience - Create new work experience
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
      company, 
      position, 
      companyLogo,
      startDate,
      endDate,
      isCurrent = false,
      description,
      technologies = [],
      order = 0,
      isVisible = true 
    } = body;

    // Validate required fields
    if (!company || !position || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Company, position, and start date are required' },
        { status: 400 }
      );
    }

    // If current position, set all other positions to not current
    if (isCurrent) {
      await WorkExperience.updateMany(
        { isCurrent: true },
        { isCurrent: false }
      );
    }

    const experience = new WorkExperience({
      company,
      position,
      companyLogo,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isCurrent,
      description,
      technologies,
      order,
      isVisible
    });

    await experience.save();

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Work experience created successfully'
    }, { status: 201 });

  } catch  {
    return NextResponse.json(
      { success: false, error: 'Failed to create work experience' },
      { status: 500 }
    );
  }
}
