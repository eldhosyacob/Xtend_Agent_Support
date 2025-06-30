import { NextResponse } from "next/server";
import connectToDatabase from "@/pages/api/db_conn";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const products = await db.collection("inventory").find({}).toArray();
    const suppliers = await db.collection("suppliers").find({}).toArray();
    const data = {
        products: products,
        suppliers: suppliers
    }
    res.status(200).json({
        status: "Sucess",
        data: data
    });
}