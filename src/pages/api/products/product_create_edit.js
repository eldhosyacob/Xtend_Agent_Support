import busboy from 'busboy';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import s3 from '@/pages/api/s3_client_conn';
import connectToDatabase from '@/pages/api/db_conn';
import { ObjectId } from 'mongodb';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
 
    const bb = busboy({ headers: req.headers });
    const fields = {};
    let uuidFilenames = [];
    let uploadPromise = null;

    const db = await connectToDatabase();
    const product = await db.collection('inventory').insertOne({});
    
    bb.on('field', (name, val) => {
        fields[name] = val;
    });

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const fileExtension = filename.split('.').pop();
        const uuidFilename = `${uuidv4()}.${fileExtension}`;
        uuidFilenames.push(uuidFilename);
        const s3Key = `HappyPaw/Products/${product.insertedId}/${uuidFilename}`;
        
        // Use Upload helper to send stream directly
        uploadPromise = new Upload({
            client: s3,
            params: {
                Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
                Key: s3Key,
                Body: file, // file is already a stream
                ContentType: mimeType,
                ACL: 'public-read',
            },
        }).done();
    });

    bb.on('finish', async () => {
        if (uploadPromise) await uploadPromise;

        await db.collection('inventory').updateOne({
            _id: product.insertedId,
        }, {
            $set: {
            productName: fields.productName,
            brandId: new ObjectId(fields.brandId),
            description: fields.description,
            barcode: fields.barcode,
            MRP: parseFloat(fields.MRP),
            sellingPrice: parseFloat(fields.sellingPrice),
            HSN: fields.HSN,
            productImages: uuidFilenames,
            currentStock: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            },
        });

        res.status(200).json({
            status: "success",
            message: 'Product created successfully',
        });
    });

    req.pipe(bb);
}
