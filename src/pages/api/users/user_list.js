import connectToDatabase from "../db_conn";

export default async function handler(req, res) {

  
    try {
        const db = await connectToDatabase();
        
        const usersWithRoles = await db.collection("ERPUsers").aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "roles",
                    foreignField: "_id",
                    as: "roles"
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    fullName: 1,
                    roles: 1,
                    isActive: 1,
                    profileImage: 1,
                    createdAt: 1
                }
            }
        ]).toArray();
        
        const roles = await db.collection("roles").find({}).toArray();
        
        res.status(200).json({ users: usersWithRoles, roles: roles });
    } catch (error) {
        console.error("Error fetching users with roles:", error);
        res.status(500).json({ message: "Database connection error" });
    }
}