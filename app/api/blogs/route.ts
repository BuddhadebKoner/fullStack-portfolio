import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog.model';
import { BlogData } from '@/types/blog';
import { auth } from '@clerk/nextjs/server';
import { Profile } from '@/models';

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

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const published = searchParams.get('published');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query: BlogQuery = {};
    
    if (published !== null && published !== undefined) {
      query.isPublished = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    const pages = Math.ceil(total / limit);

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform to BlogData format
    const transformedBlogs: BlogData[] = blogs.map(blog => ({
      _id: blog._id?.toString() ?? '',
      title: blog.title ?? '',
      desc: blog.desc ?? '',
      content: blog.content ?? '',
      author: blog.author ?? '',
      tags: blog.tags ?? [],
      imageUrl: blog.imageUrl ?? '',
      slug: blog.slug ?? '',
      isPublished: blog.isPublished ?? false,
      publishedAt: blog.publishedAt?.toISOString() ?? '',
      views: blog.views ?? 0,
      likes: blog.likes ?? 0,
      createdAt: blog.createdAt?.toISOString() ?? '',
      updatedAt: blog.updatedAt?.toISOString() ?? '',
    }));

    return NextResponse.json({
      success: true,
      data: transformedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog (for non-slug requests)
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

    // Get author name from profile
    const profile = await Profile.findOne({ clerkId: userId }).lean();
    const profileData = profile as { firstName?: string; lastName?: string } | null;
    const authorName = profileData ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() : 'Anonymous';

    const blogData = await request.json();

    // Generate slug if not provided
    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    const newBlog = new Blog({
      ...blogData,
      author: authorName,
    });

    const savedBlog = await newBlog.save();

    const transformedBlog: BlogData = {
      _id: savedBlog._id?.toString() ?? '',
      title: savedBlog.title ?? '',
      desc: savedBlog.desc ?? '',
      content: savedBlog.content ?? '',
      author: savedBlog.author ?? '',
      tags: savedBlog.tags ?? [],
      imageUrl: savedBlog.imageUrl ?? '',
      slug: savedBlog.slug ?? '',
      isPublished: savedBlog.isPublished ?? false,
      publishedAt: savedBlog.publishedAt?.toISOString() ?? '',
      views: savedBlog.views ?? 0,
      likes: savedBlog.likes ?? 0,
      createdAt: savedBlog.createdAt?.toISOString() ?? '',
      updatedAt: savedBlog.updatedAt?.toISOString() ?? '',
    };

    return NextResponse.json({
      success: true,
      data: transformedBlog,
    });

  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
