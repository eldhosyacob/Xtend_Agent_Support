import connectToDatabase from "../db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Folder } from "@/utils/s3Utils";

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

        // Check if user exists and get user data
        const user = await db.collection("ERPUsers").aggregate([
            { $match: { _id: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "roles",
                    localField: "roles",
                    foreignField: "_id",
                    as: "roleDetails"
                }
            }
        ]).toArray();

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is a Super Admin
        const isSuperAdmin = user[0].roleDetails.some(role => role.label === "Super Admin");
        if (isSuperAdmin) {
            return res.status(403).json({ message: 'Super Admin users cannot be deleted' });
        }

        // Delete user's S3 folder
        const s3FolderPath = `HappyPaw/Users/${userId}`;
        await deleteS3Folder(s3FolderPath);

        // Delete user from database
        await db.collection("ERPUsers").deleteOne({ _id: new ObjectId(userId) });

        res.status(200).json({
            status: "Success",
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
} 