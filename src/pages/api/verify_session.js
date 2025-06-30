import connectToDatabase from "./db_conn";

export default async function handler(req, res) {

  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const db = await connectToDatabase();
    const session = await db.collection("Admin User Sessions").findOne({"sessionToken": token});
    
    if (session) {
      
      if(session["status"] != "Active") {
        await db.collection("Admin User Sessions").deleteOne({"sessionToken": token});
        return res.status(401).json({ message: session["message"] });
      }
      
      console.log('Session verification successful');
      return res.status(200).json({ 
        valid: true,
        sessionToken: session,
      });
    } else {
      return res.status(401).json({ message: 'Invalid session token' });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({ message: 'Database connection error' });
  }
} 