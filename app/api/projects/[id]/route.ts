import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Project from '@/models/project.model';
import { auth } from '@clerk/nextjs/server'

// GET /api/projects/[id] - Get single project by ID
export async function GET(
   request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
   try {
      await connectToDatabase();

      const { params } = context;
      const resolvedParams = await params;
      const { id } = resolvedParams;

      const project = await Project.findById(id);
      if (!project) {
         return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         data: project
      });

   } catch {
      return NextResponse.json(
         { success: false, error: 'Failed to fetch project' },
         { status: 500 }
      );
   }
}

// PUT /api/projects/[id] - Update project
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

      const project = await Project.findByIdAndUpdate(
         id,
         body,
         { new: true, runValidators: true }
      );

      if (!project) {
         return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         data: project,
         message: 'Project updated successfully'
      });

   } catch {
      return NextResponse.json(
         { success: false, error: 'Failed to update project' },
         { status: 500 }
      );
   }
}

// DELETE /api/projects/[id] - Delete project
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

      const project = await Project.findByIdAndDelete(id);
      if (!project) {
         return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         message: 'Project deleted successfully'
      });

   } catch {
      return NextResponse.json(
         { success: false, error: 'Failed to delete project' },
         { status: 500 }
      );
   }
}
