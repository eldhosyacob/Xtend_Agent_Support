import  connectToDatabase  from "../db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Folder } from "@/utils/s3Utils";

export default async function handler(req, res) {
    // Get session data
    
    
    // Extract brand ID from URL
    const { brandId } = req.body;
    // console.log(brandId);
    // return;
    const s3FolderPath = `HappyPaw/Brands/${brandId}`;

    // Delete folder from S3
    await deleteS3Folder(s3FolderPath);

    const db = await connectToDatabase();
    db.collection("brands").deleteOne({ _id: new ObjectId(brandId) });
    res.status(200).json({
        status: "Success",
        message: "Brand deleted successfully"
    });


}