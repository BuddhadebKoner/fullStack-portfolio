import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Skill from '@/models/skill.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/skills/[id] - Get single skill by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const skill = await Skill.findById(id);
    if (!skill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skill' },
      { status: 500 }
    );
  }
}

// PUT /api/skills/[id] - Update skill
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

    // Check if updating name and if it already exists
    if (body.name) {
      const existingSkill = await Skill.findOne({
        name: { $regex: new RegExp(`^${body.name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingSkill) {
        return NextResponse.json(
          { success: false, error: 'Skill with this name already exists' },
          { status: 400 }
        );
      }
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: skill,
      message: 'Skill updated successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/[id] - Delete skill
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

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
