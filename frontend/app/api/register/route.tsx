import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

export async function POST(req: NextRequest) {
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

    // Create the new user object
    const newUser = {
      id: uuidv4(),
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

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email, name },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
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
