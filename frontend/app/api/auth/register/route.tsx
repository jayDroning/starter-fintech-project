import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

// Secret key for JWT signing (store it in an env variable in production)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

const POST = async (req: NextRequest) => {
  const { name, email, password, profilePic } = await req.json()

  try {
    // Read existing users or start with an empty array
    const fileData = fs.existsSync(USERS_FILE)
      ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
      : []

    // Check if the user already exists
    const existing = fileData.find((u: any) => u.email === email)
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Set default profile picture if not provided
    const profilePicUrl = profilePic || "https://randomuser.me/api/portraits/women/50.jpg";

    // Create the new user object (use uuid here)
    const newUser = {
      uuid: uuidv4(),  // Use uuid as the key
      name,
      email,
      password: hashedPassword,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profilePic: profilePicUrl // Store the profile picture URL
    }

    // Add the new user to the array
    fileData.push(newUser)

    // Save the updated list of users to the file
    fs.writeFileSync(USERS_FILE, JSON.stringify(fileData, null, 2))

    // Generate JWT token (include uuid in payload)
    const token = jwt.sign(
      { uuid: newUser.uuid, email, name },  // Include uuid in the token payload
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Return a success response with the token and user info
    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        uuid: newUser.uuid,  // Use uuid here
        name: newUser.name,
        email: newUser.email,
        balance: newUser.balance,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        profilePic: newUser.profilePic, // Include profile picture URL
      }
    })
  } catch (error) {
    console.error('Error in registration:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export { POST }