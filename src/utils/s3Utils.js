import s3 from '@/pages/api/s3_client_conn';
import { ListObjectsV2Command, DeleteObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteS3Folder(folderPath) {
    // Ensure folder path ends with '/' for proper prefix matching
    const s3Key = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;

    // List all objects in the folder
    const listParams = {
        Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
        Prefix: s3Key,
    };

    const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        // Delete all objects in the folder
        const deleteParams = {
            Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
            Delete: {
                Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
            },
        };

        await s3.send(new DeleteObjectsCommand(deleteParams));
        return true;
    }

    return false; // No objects found to delete
}

export async function deleteS3Object(objectKey) {
    try {
        const deleteParams = {
            Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
            Key: objectKey,
        };

        await s3.send(new DeleteObjectCommand(deleteParams));
        return true;
    } catch (error) {
        console.error('Error deleting S3 object:', error);
        return false;
    }
} 