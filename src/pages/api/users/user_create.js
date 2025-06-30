import busboy from 'busboy';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import s3 from '@/pages/api/s3_client_conn';
import connectToDatabase from "@/pages/api/db_conn";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { welcomeUserTemplate } from "../../../templates/emails/welcome-user";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const bb = busboy({ headers: req.headers });
  const fields = {};
  let profileImageFilename = null;
  let uploadPromise = null;

  const db = await connectToDatabase();
  const user = await db.collection("ERPUsers").insertOne({});

  bb.on('field', (name, val) => {
    fields[name] = name === 'roles' ? (val.startsWith('[') ? JSON.parse(val) : val) : val;
  });

  bb.on('file', (name, file, info) => {
    if (name === 'profileImage') {
      const { filename, mimeType } = info;
      profileImageFilename = `${uuidv4()}.${filename.split('.').pop()}`;

      uploadPromise = new Upload({
        client: s3,
        params: {
          Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
          Key: `HappyPaw/Users/${user.insertedId}/${profileImageFilename}`,
          Body: file,
          ContentType: mimeType,
          ACL: 'public-read',
        },
      }).done();
    }
  });

  bb.on('finish', async () => {
    const { email, fullName, roles, isActive = true } = fields;

    // Check for existing user (excluding our empty record)
    const existingUser = await db.collection("ERPUsers").findOne({
      email, _id: { $ne: user.insertedId }
    });

    if (existingUser) {
      await db.collection("ERPUsers").deleteOne({ _id: user.insertedId });
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    if (uploadPromise) await uploadPromise;

    // Generate password and hash
    const newPassword = crypto.randomBytes(12).toString('base64').slice(0, 12).replace(/\+/g, '!').replace(/\//g, '@');
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user with complete data
    await db.collection("ERPUsers").updateOne({ _id: user.insertedId }, {
      $set: {
        email,
        fullName,
        passwordHash,
        roles: Array.isArray(roles) ? roles.map(role => new ObjectId(role)) : [],
        isActive: Boolean(isActive === 'true' || isActive === true),
        profileImage: profileImageFilename,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Welcome to Happy Paw Admin',
      html: welcomeUserTemplate(fullName, newPassword),
    });

    const completeUser = await db.collection("ERPUsers").findOne({ _id: user.insertedId });
    const { passwordHash: _, ...userWithoutPassword } = completeUser;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
  });

  req.pipe(bb);
} 