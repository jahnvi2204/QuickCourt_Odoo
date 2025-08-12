const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBookingConfirmation(booking, user, facility) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Booking Confirmation - QuickCourt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmed!</h2>
          <p>Hi ${user.fullName},</p>
          <p>Your booking has been confirmed. Here are the details:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${facility.name}</h3>
            <p><strong>Court:</strong> ${booking.court.name} (${booking.court.sportType})</p>
            <p><strong>Date:</strong> ${booking.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Duration:</strong> ${booking.duration} hour(s)</p>
            <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
          </div>
          
          <p>We look forward to seeing you at the venue!</p>
          <p>Best regards,<br>The QuickCourt Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent');
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
    }
  }

  async sendOTP(email, otpCode, userName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your QuickCourt Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to QuickCourt!</h2>
          <p>Hi ${userName},</p>
          <p>Thank you for signing up! Please verify your email address using the code below:</p>
          
          <div style="background: #f3f4f6; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
          </div>
          
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          
          <p>Best regards,<br>The QuickCourt Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent');
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  }

  async sendPasswordReset(email, resetToken, userName) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - QuickCourt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hi ${userName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${resetLink}
          </p>
          
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <p>Best regards,<br>The QuickCourt Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }
}

module.exports = new EmailService();