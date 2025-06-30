import connectToDatabase from "../db_conn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const db = await connectToDatabase();
        
        // Use aggregation pipeline to get the user with their roles
        const userWithRoles = await db.collection("ERPUsers").aggregate([
            {
                $match: { _id: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roles",
                    foreignField: "_id",
                    as: "roleDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    fullName: 1,
                    isActive: 1,
                    roles: 1, // This keeps the original role IDs
                    roleDetails: 1, // This contains the full role objects
                    profileImage: 1, // Include profile image
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).toArray();
        
        if (userWithRoles.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get the first (and only) result
        const user = userWithRoles[0];
        
        // Add full profile image URL if exists
        if (user.profileImage) {
            user.profileImageUrl = `https://${process.env.NEXT_PUBLIC_APP_BUCKET_NAME}.s3.amazonaws.com/HappyPaw/Users/${userId}/${user.profileImage}`;
        }
        
        // Return the user
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Database connection error" });
    }
} 