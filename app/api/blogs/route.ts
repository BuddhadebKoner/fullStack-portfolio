import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog.model';
import { BlogData } from '@/types/blog';
import { auth } from '@clerk/nextjs/server';

// Define interface for blog query
interface BlogQuery {
  isPublished?: boolean;
  $or?: Array<{
    title?: { $regex: string; $options: string };
    desc?: { $regex: string; $options: string };
  }>;
  tags?: { $in: string[] };
}

// GET /api/blogs - Get all blogs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // If slug is provided, fetch single blog
    if (slug) {
      const blog = await Blog.findOne({ slug, isPublished: true }).lean();
      
      if (!blog) {
        return NextResponse.json(
          { success: false, error: 'Blog not found' },
          { status: 404 }
        );
      }

      // Increment views
      await Blog.updateOne({ slug }, { $inc: { views: 1 } });
      
      // Type the blog object properly
      const singleBlog = Array.isArray(blog) ? blog[0] : blog;
      const blogWithViews: BlogData = {
        _id: singleBlog._id?.toString() ?? '',
        title: singleBlog.title ?? '',
        desc: singleBlog.desc ?? '',
        content: singleBlog.content ?? '',
        author: singleBlog.author ?? '',
        tags: singleBlog.tags ?? [],
        imageUrl: singleBlog.imageUrl ?? '',
        slug: singleBlog.slug ?? '',
        isPublished: singleBlog.isPublished ?? false,
        publishedAt: singleBlog.publishedAt ?? '',
        views: (singleBlog.views ?? 0) + 1,
        likes: singleBlog.likes ?? 0,
        createdAt: singleBlog.createdAt ?? '',
        updatedAt: singleBlog.updatedAt ?? ''
      };
      
      return NextResponse.json({
        success: true,
        data: [blogWithViews]
      });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published');
    const tags = searchParams.get('tags');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query
    const query: BlogQuery = {};

    if (published !== null) {
      query.isPublished = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog
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
    const { title, desc, content, tags = [], imageUrl, isPublished = false } = body;

    // Validate required fields
    if (!title || !desc) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'A blog with this title already exists' },
        { status: 400 }
      );
    }

    const blog = new Blog({
      title,
      desc,
      content,
      tags,
      imageUrl,
      slug,
      isPublished,
      author: 'Admin' // You can get this from user profile
    });

    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
