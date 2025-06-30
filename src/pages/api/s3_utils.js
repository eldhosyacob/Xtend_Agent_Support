import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3_client_conn";
import connectToDatabase from "./db_conn";

// Ensure TTL index is created for automatic URL expiration
let indexCreated = false;
async function ensureIndexExists(db) {
  if (indexCreated) return;
  
  try {
    // Create TTL index on PresignedUrls collection
    await db.collection("Presigned URLs").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    
    // Create index on key for faster lookups
    await db.collection("Presigned URLs").createIndex(
      { key: 1 },
      { unique: true }
    );
    
    indexCreated = true;
  } catch (error) {
    console.error("Error creating indices:", error);
  }
}

/**
 * Generate a presigned URL for accessing an S3 object
 * @param {string} key - The S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default 3600 = 1 hour)
 * @returns {Promise<string>} - The presigned URL
 */
export async function generatePresignedUrl(key, expiresIn = 3600) {
  try {
    if (!key) return null;
    
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
}

/**
 * Get or create a presigned URL for accessing an S3 object, with MongoDB caching
 * @param {string} key - The S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default 3600 = 1 hour)
 * @returns {Promise<string>} - The presigned URL
 */
export async function getOrCreatePresignedUrl(key, expiresIn = 3600) {
  try {
    if (!key) return null;
    
    const db = await connectToDatabase();
    
    // Ensure indices are created
    await ensureIndexExists(db);
    
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + 900);

    // Check if we have a valid URL in the database
    const existingUrl = await db.collection("Presigned URLs").findOne({
      key: key,
      expiresAt: { $gt: expiredAt } // Not expired yet
    });
    
    if (existingUrl) {
      console.log(`Found existing presigned URL for ${key}`);
      return existingUrl.url;
    }
    
    // Generate a new URL
    const url = await generatePresignedUrl(key, expiresIn);
    
    if (url) {
      // Calculate expiration time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
      
      // Store in database with TTL index for automatic cleanup
      await db.collection("Presigned URLs").updateOne(
        { key: key },
        { 
          $set: {
            url: url,
            expiresAt: expiresAt,
            createdAt: new Date(),
            lastUsed: new Date()
          }
        },
        { upsert: true }
      );
      
      console.log(`Generated new presigned URL for ${key}`);
      return url;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting/creating presigned URL:", error);
    return null;
  }
} 