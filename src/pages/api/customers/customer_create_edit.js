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
    let customerlogofilename = null;
    let uploadPromise = null;

    const db = await connectToDatabase();
    const customer = await db.collection('customers').insertOne({});
    
    bb.on('field', (name, val) => {
        fields[name] = val;
    });

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const fileExtension = filename.split('.').pop();
        customerlogofilename = `${uuidv4()}.${fileExtension}`;
        const s3Key = `HappyPaw/Customers/${customer.insertedId}/${customerlogofilename}`;
        console.log("S3 Key:", s3Key);
        
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

            await db.collection('customers').updateOne({
            _id: customer.insertedId,
        }, {
            $set: {
            customerName: fields.customerName,
            customerLogo: customerlogofilename,
            address: fields.address,
            phoneNumber: fields.phoneNumber,
            email: fields.email,
            notes: fields.notes,
            createdAt: new Date(),
            updatedAt: new Date(),

            },
        });

        res.status(200).json({
            status: "success",
            message: 'Customer created successfully',
        });
    });

    req.pipe(bb);
}
