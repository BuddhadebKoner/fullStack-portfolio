import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Skill from '@/models/skill.model';
import { auth } from '@clerk/nextjs/server';

// GET /api/skills - Get all skills
export async function GET(request: NextRequest) {
   try {
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const visible = searchParams.get('visible');
      const sort = searchParams.get('sort') || 'order';

      // Build query
      const query: {
         category?: string;
         isVisible?: boolean;
      } = {};

      if (category) {
         query.category = category;
      }

      if (visible !== null) {
         query.isVisible = visible !== 'false';
      }

      // Execute query
      const skills = await Skill.find(query)
         .sort(sort)
         .lean();

      return NextResponse.json({
         success: true,
         data: skills
      });

   } catch{

      return NextResponse.json(
         { success: false, error: 'Failed to fetch skills' },
         { status: 500 }
      );
   }
}

// POST /api/skills - Create new skill
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
         name,
         category = 'other',
         level = 'intermediate',
         order = 0,
         isVisible = true
      } = body;

      // Validate required fields
      if (!name) {
         return NextResponse.json(
            { success: false, error: 'Skill name is required' },
            { status: 400 }
         );
      }

      // Check if skill already exists
      const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingSkill) {
         return NextResponse.json(
            { success: false, error: 'Skill already exists' },
            { status: 400 }
         );
      }

      const skill = new Skill({
         name,
         category,
         level,
         order,
         isVisible
      });

      await skill.save();

      return NextResponse.json({
         success: true,
         data: skill,
         message: 'Skill created successfully'
      }, { status: 201 });

   } catch {
      return NextResponse.json(
         { success: false, error: 'Failed to create skill' },
         { status: 500 }
      );
   }
}

// PUT /api/skills - Bulk update skills order
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
      const { skills } = body;

      if (!Array.isArray(skills)) {
         return NextResponse.json(
            { success: false, error: 'Skills array is required' },
            { status: 400 }
         );
      }

      // Update each skill's order
      const updatePromises = skills.map((skill: { id: string; order: number }) =>
         Skill.findByIdAndUpdate(skill.id, { order: skill.order })
      );

      await Promise.all(updatePromises);

      return NextResponse.json({
         success: true,
         message: 'Skills order updated successfully'
      });

   } catch  {

      return NextResponse.json(
         { success: false, error: 'Failed to update skills order' },
         { status: 500 }
      );
   }
}
