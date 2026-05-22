import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import { jobSchema } from '@/schemas/jobSchema';
import { getErrorMessage } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    
    const query: Record<string, string> = {};
    if (status) query.status = status;
    if (department) query.department = department;
    
    const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('API Jobs GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Request validation with Zod
    const validationResult = jobSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const job = await Job.create(validationResult.data);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('API Jobs POST Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}
