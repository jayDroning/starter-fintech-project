import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // jwt for creating tokens
import { usersDB } from '@/app/lib/usersDB';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use your secret key

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if both email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if the email already exists
    const existingUser = usersDB.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and add it to the database (mock in this case)
    const newUser = {
      id: usersDB.length + 1, // Simple increment for mock ID
      email,
      password: hashedPassword,
    };

    usersDB.push(newUser); // Add the new user to the "database"

    // Create a JWT token for the new user
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}