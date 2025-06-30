import connectToDatabase from "../db_conn";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { resetPasswordTemplate } from "../../../templates/emails/reset-password";

const handler = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ status: 'Failed', message: 'Email is required' });
    }

    const db = await connectToDatabase();
    const user = await db.collection("Admin Users").findOne({ email });

    // This prevents email enumeration attacks
    if (!user) {
      return res.json({ 
        status: 'Success', 
        message: 'If your email exists in our system, you will receive reset instructions shortly.' 
      });
    }

    // Generate a reset token (random string)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiration (24 hours from now)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 24);

    // Store the token and expiry in the database
    await db.collection("Admin Users").updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry
        } 
      }
    );

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPassword?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content using the updated template
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'AptyRead - Password Reset Request',
      html: resetPasswordTemplate(user.fullName, resetLink),
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.json({
      status: 'Success',
      message: 'If your email exists in our system, you will receive reset instructions shortly.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ status: 'Failed', message: 'Internal Server Error' });
  }
};

export default handler; 