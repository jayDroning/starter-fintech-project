import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // bcrypt for comparing passwords
import jwt from 'jsonwebtoken'; // jwt for creating tokens
import { usersDB } from '@/app/lib/usersDB';

// Secret key for JWT signing (store it in an env variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate that both email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user in the "database" (mocked here)
    const user = usersDB.find((user) => user.email === email);

    
    // If user is not found, return an error
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare the hashed password with the user's input password
    const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordd = 'password123'; // The plain password you want to hash

    // Hash the password
    bcrypt.hash(passwordd, 10, (err, hash) => {
      if (err) throw err;
      console.log(hash); // This is your hashed password
    });
    console.log(password);

    console.log(user.password);
    
    // If passwords don't match, return an error
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create a JWT token (expires in 1 hour)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token back to the client
    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
