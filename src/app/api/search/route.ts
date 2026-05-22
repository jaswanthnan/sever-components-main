import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import Job from '@/lib/models/Job';

/**
 * 🚀 CONCEPT: Dynamic API Route
 * This route is dynamic because it depends on request parameters.
 * It searches both Candidates and Jobs collections.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ candidates: [], jobs: [] });
  }

  try {
    await dbConnect();

    // Case-insensitive search using regex
    const regex = new RegExp(query, 'i');

    const [candidates, jobs] = await Promise.all([
      Candidate.find({
        $or: [
          { name: regex },
          { email: regex },
          { skills: regex }
        ]
      }).limit(5).lean(),
      Job.find({
        $or: [
          { title: regex },
          { department: regex },
          { location: regex }
        ],
        status: 'Open'
      }).limit(5).lean()
    ]);

    return NextResponse.json({
      candidates,
      jobs
    });
  } catch (error) {
    console.error('API Search Error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
