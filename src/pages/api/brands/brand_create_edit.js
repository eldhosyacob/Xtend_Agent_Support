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
    let brandlogofilename = null;
    let uploadPromise = null;

    const db = await connectToDatabase();
    const brand = await db.collection('brands').insertOne({});
    
    bb.on('field', (name, val) => {
        fields[name] = val;
    });

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const fileExtension = filename.split('.').pop();
        brandlogofilename = `${uuidv4()}.${fileExtension}`;
        const s3Key = `HappyPaw/Brands/${brand.insertedId}/${brandlogofilename}`;
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

            await db.collection('brands').updateOne({
            _id: brand.insertedId,
        }, {
            $set: {
            brandName: fields.brandName,
            brandLogo: brandlogofilename,
            websiteURL: fields.websiteURL,
            description: fields.description,
            active: fields.active === 'true',
            createdAt: new Date(),
            updatedAt: new Date(),

            },
        });

        res.status(200).json({
            status: "success",
            message: 'Brand created successfully',
        });
    });

    req.pipe(bb);
}
