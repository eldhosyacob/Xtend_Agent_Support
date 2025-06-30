import connectToDatabase from "@/pages/api/db_conn";

export default async function handler(req, res) {

    const db = await connectToDatabase();

    const brands = await db.collection("brands").find({}).toArray();




    res.status(200).json({ brands});

}