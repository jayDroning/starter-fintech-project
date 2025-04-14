import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Secret key for JWT signing (store it in an env variable in production)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

const POST = async (req: NextRequest) => {
  const { email, password } = await req.json()

  try {
    if (!fs.existsSync(USERS_FILE)) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 })
    }

    const fileData = fs.readFileSync(USERS_FILE, 'utf-8')
    const users = JSON.parse(fileData)

    // Find the user by email
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // Generate JWT token with uuid, email, and name
    const token = jwt.sign(
      { uuid: user.uuid, email: user.email, name: user.name }, // Include the uuid in the payload
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Return the response with the token
    return NextResponse.json({ message: 'Login successful', token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Server error during login' }, { status: 500 })
  }
}

export { POST }