import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { config } from '../config/config.js'
import { sendEmail } from '../utils/sendEmail.js'
import { generateOtp } from '../utils/otp.js'

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  })
}

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }

  res.cookie('token', token, cookieOptions)
}

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    })

    // Generate email verification OTP
    const otp = generateOtp(6)
    user.emailVerificationCode = otp
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'DreamNest - Email Verification Code',
      html: `
        <h2>Verify your email</h2>
        <p>Hi ${user.name},</p>
        <p>Your DreamNest verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code will expire in 10 minutes.</p>
      `,
      text: `Your DreamNest verification code is ${otp}. It will expire in 10 minutes.`
    })

    // Generate token (user can be logged in immediately)
    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.status(201).json({
      success: true,
      message: 'User registered successfully. A verification code has been sent to your email.',
      user: user.getPublicProfile(),
      token
    })
  } catch (error) {
    console.error('Register user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user and include password for comparison
    const user = await User.findByEmail(email).select('+password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // If email is not verified, resend verification OTP and block login
    if (!user.isEmailVerified) {
      const otp = generateOtp(6)
      user.emailVerificationCode = otp
      user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      await user.save()

      try {
        await sendEmail({
          to: user.email,
          subject: 'DreamNest - Email Verification Code',
          html: `
            <h2>Verify your email</h2>
            <p>Hi ${user.name},</p>
            <p>Your DreamNest verification code is:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
            <p>This code will expire in 10 minutes.</p>
          `,
          text: `Your DreamNest verification code is ${otp}. It will expire in 10 minutes.`
        })
      } catch (e) {
        console.error('Error sending verification email during login:', e)
      }

      return res.status(403).json({
        success: false,
        message: 'Your email is not verified. A verification code has been sent to your email.'
      })
    }
    
    // Email is verified: start 2FA login with OTP on EVERY login
    const loginOtp = generateOtp(6)
    user.loginOtp = loginOtp
    user.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    await user.save()

    try {
      await sendEmail({
        to: user.email,
        subject: 'DreamNest - Login Verification Code',
        html: `
          <h2>Login verification</h2>
          <p>Hi ${user.name},</p>
          <p>Your DreamNest login verification code is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${loginOtp}</p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not try to log in, you can ignore this email.</p>
        `,
        text: `Your DreamNest login verification code is ${loginOtp}. It will expire in 5 minutes.`
      })
    } catch (e) {
      console.error('Error sending login OTP email:', e)
    }

    // Do NOT issue JWT yet – client must call verifyLoginOtp
    res.json({
      success: true,
      otpRequired: true,
      message: 'A login verification code has been sent to your email.'
    })
  } catch (error) {
    console.error('Login user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// @desc    Verify login OTP (second factor) and issue JWT
// @route   POST /api/users/login/verify-otp
// @access  Public
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      })
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your email is not verified. Please verify your email first.'
      })
    }

    if (!user.loginOtp || !user.loginOtpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No login verification code found. Please login again.'
      })
    }

    if (user.loginOtpExpires.getTime() < Date.now()) {
      user.loginOtp = undefined
      user.loginOtpExpires = undefined
      await user.save()

      return res.status(400).json({
        success: false,
        message: 'Login verification code has expired. Please login again.'
      })
    }

    if (user.loginOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code.'
      })
    }

    // OTP ok – clear it and complete login
    user.loginOtp = undefined
    user.loginOtpExpires = undefined
    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.json({
      success: true,
      message: 'Login successful',
      user: user.getPublicProfile(),
      token
    })
  } catch (error) {
    console.error('Verify login OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error verifying login OTP'
    })
  }
}

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true
  })

  res.json({
    success: true,
    message: 'Logged out successfully'
  })
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        })
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone })
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    })
  }
}

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      })
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    })
  }
}

// @desc    Verify email with OTP
// @route   POST /api/users/verify-email
// @access  Public
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please register again.'
      })
    }

    if (user.emailVerificationExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please register again.'
      })
    }

    if (user.emailVerificationCode !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code.'
      })
    }

    user.isEmailVerified = true
    user.emailVerificationCode = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.json({
      success: true,
      message: 'Email verified successfully.',
      user: user.getPublicProfile(),
      token
    })
  } catch (error) {
    console.error('Verify email OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error verifying email'
    })
  }
}
