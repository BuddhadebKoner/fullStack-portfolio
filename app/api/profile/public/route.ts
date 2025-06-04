import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Profile from '@/models/profile.model';

// GET /api/profile/public - Get public profile
export async function GET() {
  try {
    await connectToDatabase();

    const profile = await Profile.findOne({ isPublic: true })
      .select('-userId')
      .lean();
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Public profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error: unknown) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public profile' },
      { status: 500 }
    );
  }
}
