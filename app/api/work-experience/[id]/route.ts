import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkExperience from '@/models/workExperience.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/work-experience/[id] - Get single work experience by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const experience = await WorkExperience.findById(id);
    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Work experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work experience' },
      { status: 500 }
    );
  }
}

// PUT /api/work-experience/[id] - Update work experience
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    // If setting as current position, set all other positions to not current
    if (body.isCurrent === true) {
      await WorkExperience.updateMany(
        { isCurrent: true, _id: { $ne: id } },
        { isCurrent: false }
      );
    }

    // Convert date strings to Date objects
    if (body.startDate) {
      body.startDate = new Date(body.startDate);
    }
    if (body.endDate) {
      body.endDate = new Date(body.endDate);
    }

    const experience = await WorkExperience.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Work experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Work experience updated successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update work experience' },
      { status: 500 }
    );
  }
}

// DELETE /api/work-experience/[id] - Delete work experience
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const experience = await WorkExperience.findByIdAndDelete(id);
    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Work experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Work experience deleted successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete work experience' },
      { status: 500 }
    );
  }
}
