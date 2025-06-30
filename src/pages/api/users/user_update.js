import busboy from 'busboy';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import s3 from '@/pages/api/s3_client_conn';
import connectToDatabase from "@/pages/api/db_conn";
import { ObjectId } from "mongodb";
import { deleteS3Object } from "@/utils/s3Utils";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'PUT' && req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const bb = busboy({ headers: req.headers });
    const fields = {};
    let newProfileImageFilename = null;
    let uploadPromise = null;

    const db = await connectToDatabase();

    bb.on('field', (name, val) => {
        if (name === 'roles') {
            try {
                fields[name] = JSON.parse(val);
            } catch (error) {
                fields[name] = val;
            }
        } else {
            fields[name] = val;
        }
    });

    bb.on('file', (name, file, info) => {
        if (name === 'profileImage') {
            const { filename, mimeType } = info;
            const fileExtension = filename.split('.').pop();
            newProfileImageFilename = `${uuidv4()}.${fileExtension}`;
            const s3Key = `HappyPaw/Users/${fields.userId}/${newProfileImageFilename}`;
            
            uploadPromise = new Upload({
                client: s3,
                params: {
                    Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
                    Key: s3Key,
                    Body: file,
                    ContentType: mimeType,
                    ACL: 'public-read',
                },
            }).done();
        }
    });

    bb.on('finish', async () => {
        const { userId, fullName, roles, isActive, deleteProfileImage } = fields;

        // Validate input
        if (!userId || !fullName || roles === undefined || isActive === undefined) {
            return res.status(400).json({ message: 'User ID, full name, roles array and active status are required' });
        }

        try {
            // Check if user exists and get current data
            const existingUser = await db.collection("ERPUsers").findOne({ _id: new ObjectId(userId) });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user is a Super Admin
            const userWithRoles = await db.collection("ERPUsers").aggregate([
                { $match: { _id: new ObjectId(userId) } },
                {
                    $lookup: {
                        from: "roles",
                        localField: "roles",
                        foreignField: "_id",
                        as: "roleDetails"
                    }
                }
            ]).toArray();
            
            if (userWithRoles.length > 0) {
                const isSuperAdmin = userWithRoles[0].roleDetails.some(role => role.label === "Super Admin");
                if (isSuperAdmin) {
                    return res.status(403).json({ message: 'Super Admin users cannot be edited' });
                }
            }

            // Handle file upload if present
            if (uploadPromise) {
                await uploadPromise;
                
                // Delete old profile image if exists
                if (existingUser.profileImage) {
                    const oldImageKey = `HappyPaw/Users/${userId}/${existingUser.profileImage}`;
                    try {
                        await deleteS3Object(oldImageKey);
                    } catch (deleteError) {
                        console.error('Error deleting old image:', deleteError);
                    }
                }
            }

            // Prepare update object
            const updateData = {
                fullName,
                roles: Array.isArray(roles) ? roles.map(role => new ObjectId(role)) : [],
                isActive: Boolean(isActive === 'true' || isActive === true),
                updatedAt: new Date()
            };

            const updateOperation = { $set: updateData };

            // Handle profile image updates
            if (newProfileImageFilename) {
                updateData.profileImage = newProfileImageFilename;
            } else if (deleteProfileImage === 'true' || deleteProfileImage === true) {
                // Delete old image and remove field
                if (existingUser.profileImage) {
                    const oldImageKey = `HappyPaw/Users/${userId}/${existingUser.profileImage}`;
                    try {
                        await deleteS3Object(oldImageKey);
                    } catch (deleteError) {
                        console.error('Error deleting old image:', deleteError);
                    }
                }
                updateOperation.$unset = { profileImage: "" };
            }

            // Update the user
            const result = await db.collection("ERPUsers").updateOne(
                { _id: new ObjectId(userId) },
                updateOperation
            );

            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: 'No changes made to user' });
            }

            // Get updated user
            const updatedUser = await db.collection("ERPUsers").findOne({ _id: new ObjectId(userId) });
            const { passwordHash, ...userWithoutPassword } = updatedUser;

            // Add full profile image URL if exists
            if (userWithoutPassword.profileImage) {
                userWithoutPassword.profileImageUrl = `https://${process.env.NEXT_PUBLIC_APP_BUCKET_NAME}.s3.amazonaws.com/HappyPaw/Users/${userId}/${userWithoutPassword.profileImage}`;
            }

            res.status(200).json({
                message: 'User updated successfully',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user' });
        }
    });

    bb.on('error', (error) => {
        console.error('Busboy error:', error);
        res.status(500).json({ message: 'File upload error' });
    });

    req.pipe(bb);
} 