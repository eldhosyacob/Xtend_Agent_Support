import connectToDatabase from "@/pages/api/db_conn";

export default async function handler(req, res) {

    const db = await connectToDatabase();

    const suppliers = await db.collection("suppliers").find({}).toArray();




    res.status(200).json({ suppliers});

}