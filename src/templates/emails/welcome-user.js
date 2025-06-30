/**
 * Welcome email template for new users
 * @param {string} fullName - User's full name
 * @param {string} newPassword - The newly generated password
 * @returns {string} HTML content for the email
 */
export const welcomeUserTemplate = (fullName, newPassword) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Welcome to Happy Paw Admin</h2>
  <p>Hello ${fullName || 'User'},</p>
  <p>Your account has been created successfully. Here is your temporary password:</p>
  <p style="background-color: #f0f0f0; padding: 10px; font-family: monospace;">${newPassword}</p>
  <p>Please use this password to log in and then change it immediately for security reasons.</p>
  <p>Best regards,<br>Happy Paw Team</p>
</div>
`; 