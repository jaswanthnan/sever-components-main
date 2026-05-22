import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getErrorMessage } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Please enter both email/username and password.' }, { status: 400 });
    }
    
    // 1. Support hardcoded admin for backward compatibility
    if (username === 'admin') {
      if (password === 'password') {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ message: 'Enter proper password' }, { status: 400 });
      }
    }
    
    // 2. Search in DB
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!user) {
      return NextResponse.json({ message: 'Enter proper email' }, { status: 400 });
    }
    
    // 3. Compare password directly (plain text as registered in register route)
    if (user.password !== password) {
      return NextResponse.json({ message: 'Enter proper password' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
  }
}
