import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import { serverCandidateSchema } from '@/schemas/candidateSchema';
import { getErrorMessage } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: Record<string, string> = {};
    if (status) query.status = status;
    const candidates = await Candidate.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('API Candidates GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Request validation with Zod
    const validationResult = serverCandidateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const candidate = await Candidate.create(validationResult.data);
    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('API Candidates POST Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}
