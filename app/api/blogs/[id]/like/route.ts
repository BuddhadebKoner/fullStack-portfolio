import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog.model';

// GET /api/blogs/[id]/like - Like/Unlike blog
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment likes
    blog.likes += 1;
    await blog.save();

    return NextResponse.json({
      success: true,
      data: { likes: blog.likes },
      message: 'Blog liked successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to like blog' },
      { status: 500 }
    );
  }
}
