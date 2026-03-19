const nodemailer = require("nodemailer");

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generate a random 6-digit OTP
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email to the user
 * @param {string} email - Recipient email
 * @param {string} otp - The OTP code
 * @param {string} name - User's name for personalization
 */
async function sendOtpEmail(email, otp, name = "there") {
  const mailOptions = {
    from: `"Algyñ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Algyñ account",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 700; color: #111827; margin: 0;">Algyñ</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Email Verification</p>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Hey ${name} 👋
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Welcome to Algyñ! Use the code below to verify your email address:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 12px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${otp}</span>
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          This code expires in <strong>10 minutes</strong>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          If you didn't create an account on Algyñ, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { generateOtp, sendOtpEmail };
