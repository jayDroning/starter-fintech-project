import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { usersDB } from '@/app/lib/usersDB';


// JWT Secret (store this securely in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function GET(req: Request) {
  try {
    // Get token from headers
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user by the decoded ID
    const user = usersDB.find((user) => user.id === decoded.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data (avoid sending password)
    const { password, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json({ error: 'Failed to retrieve user data' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = usersDB.find((user) => user.id === decoded.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedData = await req.json();
    // Here we assume the full user object needs to be updated
    user.email = updatedData.email;
    user.name = updatedData.name;
    user.profilePic = updatedData.profilePic; // Example of updating profile picture

    return NextResponse.json({ message: 'User profile updated successfully', user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}