import  connectToDatabase  from "../db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Folder } from "@/utils/s3Utils";


export default async function handler(req, res) {
    // Get session data
    
    
    // Extract supplier ID from URL
    const { supplierId } = req.body;
    // console.log(supplierId);
    // return;
    const s3FolderPath = `HappyPaw/Suppliers/${supplierId}`;

    // Delete folder from S3
    await deleteS3Folder(s3FolderPath);
    
    const db = await connectToDatabase();
    db.collection("suppliers").deleteOne({ _id: new ObjectId(supplierId) });
    res.status(200).json({
        status: "Success",
        message: "Supplier deleted successfully"
    });


}