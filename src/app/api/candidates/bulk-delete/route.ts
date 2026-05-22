import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import { getErrorMessage } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid candidate IDs' }, { status: 400 });
    }
    
    const result = await Candidate.deleteMany({ _id: { $in: ids } });
    
    return NextResponse.json({ 
      message: 'Candidates deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('API Candidates Bulk Delete Error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
