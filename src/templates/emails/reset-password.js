/**
 * Reset password email template
 * @param {string} fullName - User's full name
 * @param {string} resetLink - The password reset link
 * @returns {string} HTML content for the email
 */
export const resetPasswordTemplate = (fullName, resetLink) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Password Reset Request</h2>
  <p>Hello ${fullName || 'User'},</p>
  <p>We received a request to reset your password for your AptyRead Admin account. Click the button below to reset your password:</p>
  <p style="text-align: center; margin: 25px 0;">
    <a href="${resetLink}" style="background-color: #0070f3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
  </p>
  <p>If you can't click the button, you can also copy and paste the following link into your browser:</p>
  <p style="background-color: #f0f0f0; padding: 10px; word-break: break-all;">${resetLink}</p>
  <p>This link will expire in 24 hours for security reasons.</p>
  <p>If you did not request this password reset, you can safely ignore this email - your password will not be changed.</p>
  <p>Best regards,<br>AptyRead Team</p>
</div>
`; 