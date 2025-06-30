import connectToDatabase from "@/pages/api/db_conn";
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    
    if (!token || !email || !password) {
      return res.status(400).json({ 
        status: 'Failed', 
        message: 'Token, email and password are required' 
      });
    }

    const db = await connectToDatabase();
    
    // Find the user with this email and token
    const user = await db.collection("Admin Users").findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Token must not be expired
    });

    if (!user) {
      return res.json({ 
        status: 'Failed', 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password and clear the reset token
    await db.collection("Admin Users").updateOne(
      { _id: user._id },
      { 
        $set: { passwordHash: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );

    return res.json({
      status: 'Success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ 
      status: 'Failed', 
      message: 'Internal Server Error' 
    });
  }
};

export default handler; 