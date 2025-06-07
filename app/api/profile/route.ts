import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Profile from '@/models/profile.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const profile = await Profile.findOne({ userId }).lean();
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB ObjectId to string for JSON serialization
    const profileData = {
      ...profile,
      _id: (profile as { _id: { toString(): string } })._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create new profile
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
      firstName, 
      lastName, 
      email,
      phone,
      address,
      city,
      country,
      bio,
      avatar,
      socialLinks = {},
      isPublic = true,
      resumeUrl = ''
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists' },
        { status: 400 }
      );
    }

    const profile = new Profile({
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      bio,
      avatar,
      socialLinks,
      isPublic,
      resumeUrl
    });

    await profile.save();

    // Convert MongoDB ObjectId to string for JSON serialization
    const profileData = {
      ...profile.toObject(),
      _id: profile._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      message: 'Profile created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating profile:', error);
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const validationErrors = Object.values((error as { errors: Record<string, { message: string }> }).errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000 && 'keyPattern' in error) {
      const field = Object.keys((error as { keyPattern: Record<string, unknown> }).keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update or create user's profile (upsert)
export async function PUT(request: NextRequest) {
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
      firstName, 
      lastName, 
      email,
      phone,
      address,
      city,
      country,
      bio,
      avatar,
      socialLinks = {},
      isPublic = true,
      resumeUrl = ''
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with upsert option to create if not exists or update if exists
    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        bio,
        avatar,
        socialLinks,
        isPublic,
        resumeUrl
      },
      { 
        new: true, 
        runValidators: true, 
        upsert: true // This creates the document if it doesn't exist
      }
    );

    // Convert MongoDB ObjectId to string for JSON serialization
    const profileData = {
      ...profile.toObject(),
      _id: profile._id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      message: 'Profile saved successfully'
    });

  } catch (error: unknown) {
    console.error('Error saving profile:', error);
    
    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const validationErrors = Object.values((error as { errors: Record<string, { message: string }> }).errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000 && 'keyPattern' in error) {
      const field = Object.keys((error as { keyPattern: Record<string, unknown> }).keyPattern)[0];
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
