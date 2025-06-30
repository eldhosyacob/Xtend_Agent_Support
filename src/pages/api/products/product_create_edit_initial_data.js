import connectToDatabase from "../db_conn";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const HSNs = await db.collection("HSNs").find({}).toArray();
    const brands = await db.collection("brands").find({}).toArray();
    res.status(200).json({ HSNs, brands });
}