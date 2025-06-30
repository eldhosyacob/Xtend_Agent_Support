import connectToDatabase from "../db_conn";

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const roles = await db.collection("roles").find({ label: { $ne: "Super Admin" } }).toArray();

        res.status(200).json(roles);

    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ message: "Database connection error" });
    }
} 