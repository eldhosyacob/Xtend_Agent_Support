import  connectToDatabase  from "../db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Folder } from "@/utils/s3Utils";


export default async function handler(req, res) {
    // Get session data
    
    
    // Extract supplier ID from URL
    const { customerId } = req.body;
    // console.log(supplierId);
    // return;
    const s3FolderPath = `HappyPaw/Customers/${customerId}`;

    // Delete folder from S3
    await deleteS3Folder(s3FolderPath);
    
    const db = await connectToDatabase();
    db.collection("customers").deleteOne({ _id: new ObjectId(customerId) });
    res.status(200).json({
        status: "Success",
        message: "Customer deleted successfully"
    });


}