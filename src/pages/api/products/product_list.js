import connectToDatabase from "@/pages/api/db_conn";

export default async function handler(req, res) {

    const db = await connectToDatabase();
    
    const products = await db.collection("inventory").find({}).toArray();
    
    res.status(200).json({ products });
}