import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Blog from '@/models/blog.model';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// GET /api/blogs/[id] - Get single blog by ID or slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { params } = context;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let blog = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    blog.views += 1;

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (err) {
    console.error('Blog details API error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update blog
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
    const { title, desc, content, tags, imageUrl, isPublished } = body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update slug if title changed
    if (title && title !== blog.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');

      // Check if new slug already exists
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBlog) {
        return NextResponse.json(
          { success: false, error: 'A blog with this title already exists' },
          { status: 400 }
        );
      }
      blog.slug = newSlug;
    }

    // Update fields
    if (title !== undefined) blog.title = title;
    if (desc !== undefined) blog.desc = desc;
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) blog.tags = tags;
    if (imageUrl !== undefined) blog.imageUrl = imageUrl;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete blog
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

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
