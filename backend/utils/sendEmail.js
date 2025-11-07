import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

const createTransporter = () => {
  if (!config.EMAIL_USER || !config.EMAIL_PASS) {
    console.warn('Email configuration not found. Email functionality will be disabled.')
    return null
  }

  return nodemailer.createTransporter({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS
    }
  })
}

export const sendEmail = async (options) => {
  const transporter = createTransporter()
  
  if (!transporter) {
    console.log('Email not sent - no transporter configured')
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const mailOptions = {
      from: `DreamNest <${config.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export const sendBookingNotification = async (booking) => {
  const subject = `New Booking Request - ${booking.propertyId.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New Booking Request</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Property Details</h3>
        <p><strong>Title:</strong> ${booking.propertyId.title}</p>
        <p><strong>Location:</strong> ${booking.propertyId.district}, ${booking.propertyId.thana}, ${booking.propertyId.area}, ${booking.propertyId.road}</p>
        <p><strong>Price:</strong> TK ${booking.propertyId.price.toLocaleString()}</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Customer Details</h3>
        <p><strong>Name:</strong> ${booking.userId.name}</p>
        <p><strong>Email:</strong> ${booking.userId.email}</p>
        <p><strong>Phone:</strong> ${booking.userId.phone}</p>
      </div>
      
      ${booking.message ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Customer Message</h3>
          <p>${booking.message}</p>
        </div>
      ` : ''}
      
      <p style="margin-top: 30px;">
        <a href="${config.FRONTEND_URL}/admin/bookings" 
           style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Booking
        </a>
      </p>
    </div>
  `

  return await sendEmail({
    to: config.EMAIL_FROM,
    subject,
    html
  })
}

export const sendBookingStatusUpdate = async (booking) => {
  const subject = `Booking ${booking.status} - ${booking.propertyId.title}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">Booking Status Update</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your booking has been ${booking.status.toLowerCase()}</h3>
        <p><strong>Property:</strong> ${booking.propertyId.title}</p>
        <p><strong>Location:</strong> ${booking.propertyId.district}, ${booking.propertyId.thana}, ${booking.propertyId.area}, ${booking.propertyId.road}</p>
        <p><strong>Status:</strong> <span style="color: ${booking.status === 'Approved' ? '#22c55e' : '#ef4444'}">${booking.status}</span></p>
      </div>
      
      ${booking.adminNotes ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Admin Notes</h3>
          <p>${booking.adminNotes}</p>
        </div>
      ` : ''}
      
      <p style="margin-top: 30px;">
        <a href="${config.FRONTEND_URL}/my-bookings" 
           style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View My Bookings
        </a>
      </p>
    </div>
  `

  return await sendEmail({
    to: booking.userId.email,
    subject,
    html
  })
}
