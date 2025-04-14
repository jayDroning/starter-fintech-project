import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Example user API
const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET); // Decode token
    // console.log(decoded); // Debugging: Check the decoded token

    // Find the user by the decoded uuid (assuming you are storing user data in a JSON file)
    const fileData = fs.existsSync(USERS_FILE)
      ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
      : [];
    
    const user = fileData.find((u: any) => u.uuid === decoded.uuid); // Compare by uuid

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return full user details excluding password
    const { password, ...safeUserData } = user;
    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('Error loading user data:', error);
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
  }
}

const PUT = async (req: NextRequest) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    // Verify the token and decode the uuid
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userUuid = decoded.uuid;  // Make sure this contains the uuid

    // Read the users file
    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json({ error: 'Users file not found' }, { status: 500 });
    }

    const fileData = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(fileData);

    // Find the user to update by uuid
    const userIndex = users.findIndex((user: any) => user.uuid === userUuid); // Compare by uuid
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the updated data from the request body
    const updatedData = await req.json();

    // Update only the fields that are provided
    if (updatedData.email) {
      users[userIndex].email = updatedData.email;
    }
    if (updatedData.name) {
      users[userIndex].name = updatedData.name;
    }
    if (updatedData.profilePic) {
      users[userIndex].profilePic = updatedData.profilePic;
    }

    // Optionally update any other fields as needed

    // Save the updated users array to the file
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    // Return a success response with the updated user data
    const safeUser = {
      uuid: users[userIndex].uuid, // Include uuid in the response
      name: users[userIndex].name,
      email: users[userIndex].email,
      profilePic: users[userIndex].profilePic,
      balance: users[userIndex].balance,
      createdAt: users[userIndex].createdAt,
      updatedAt: users[userIndex].updatedAt,
    };

    return NextResponse.json({ message: 'User profile updated successfully', user: safeUser });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

export { PUT, GET }