import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/project.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/projects - Get all projects with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const sort = searchParams.get('sort') || 'order';

    // Build query
    const query: {
      isPublished?: boolean;
      category?: string;
      featured?: boolean;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        desc?: { $regex: string; $options: string };
        technologies?: { $in: RegExp[] };
      }>;
    } = {};
    
    if (published !== null) {
      query.isPublished = published !== 'false';
    }
    
    if (category) {
      query.category = category;
    }
    
    if (featured !== null) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with aggregation to truncate description
    const projects = await Project.aggregate([
      { $match: query },
      {
        $project: {
          title: 1,
          desc: { $substr: ["$desc", 0, 100] }, // Limit to first 100 characters
          img: 1,
          technologies: 1,
          githubUrl: 1,
          liveUrl: 1,
          category: 1,
          featured: 1,
          isPublished: 1,
          order: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { [sort]: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Project.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
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
      title, 
      desc, 
      img, 
      technologies = [], 
      githubUrl, 
      liveUrl, 
      category = 'web',
      featured = false,
      isPublished = true,
      order = 0
    } = body;

    // Validate required fields
    if (!title || !desc || !img) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and image are required' },
        { status: 400 }
      );
    }

    const project = new Project({
      title,
      desc,
      img,
      technologies,
      githubUrl,
      liveUrl,
      category,
      featured,
      isPublished,
      order
    });

    await project.save();

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 });

  } catch  {
 
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
