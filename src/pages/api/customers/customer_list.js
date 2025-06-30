import connectToDatabase from "@/pages/api/db_conn";

export default async function handler(req, res) {

    const db = await connectToDatabase();
    
    const customers = await db.collection("customers").find({}).toArray();
    
    res.status(200).json({ customers });
}