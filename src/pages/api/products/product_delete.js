import  connectToDatabase  from "../db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Folder } from "@/utils/s3Utils";

export default async function handler(req, res) {
    // Get session data
    
    
    // Extract product ID from URL
    const { productId } = req.body;
    // console.log(productId);
    // return;
    const s3FolderPath = `HappyPaw/Products/${productId}`;

    // Delete folder from S3
    await deleteS3Folder(s3FolderPath);

    const db = await connectToDatabase();
    db.collection("inventory").deleteOne({ _id: new ObjectId(productId) });
    res.status(200).json({
        status: "Success",
        message: "Product deleted successfully"
    });

    return;

}