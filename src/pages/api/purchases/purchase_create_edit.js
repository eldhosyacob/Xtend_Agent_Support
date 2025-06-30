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
    const purchase = await db.collection('purchases').insertOne({});
    
    bb.on('field', (name, val) => {
        if (name === 'purchaseItems' || name === 'discounts') {
            fields[name] = JSON.parse(val);
        } else {
            fields[name] = val;
        }
    });

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const fileExtension = filename.split('.').pop();
        const uuidFilename = `${uuidv4()}.${fileExtension}`;
        uuidFilenames.push(uuidFilename);
        const s3Key = `HappyPaw/PurchaseBills/${purchase.insertedId}/${uuidFilename}`;
        
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
        }).done().catch(error => {
            console.error('S3 upload failed:', error);
            throw error;
        });
    });

    bb.on('finish', async () => {
        if (uploadPromise) {
            try {
                await uploadPromise;
            } catch (error) {
                console.error('File upload failed:', error);
                return res.status(500).json({
                    status: "error",
                    message: 'File upload failed'
                });
            }
        }

            // Calculate totals
            let grandTotal = 0;
            let totalQuantity = 0;

            const processedItems = fields.purchaseItems?.map(item => {
                const itemTotal = (parseFloat(item.purchasePrice) || 0) * (parseFloat(item.quantity) || 0);
                const discountAmount = item.discountType === 'Percentage' 
                    ? (itemTotal * (parseFloat(item.discount) || 0)) / 100
                    : (parseFloat(item.discount) || 0);
                const finalItemTotal = itemTotal - discountAmount;
                
                grandTotal += finalItemTotal;
                totalQuantity += parseFloat(item.quantity) || 0;

                return {
                    productId: new ObjectId(item.productId),
                    purchasePrice: parseFloat(item.purchasePrice) || 0,
                    quantity: parseFloat(item.quantity) || 0,
                    discount: parseFloat(item.discount) || 0,
                    discountType: item.discountType || 'Percentage',
                    itemTotal: finalItemTotal
                };
            }) || [];

            // Process general discounts
            const processedDiscounts = fields.discounts?.filter(discount => 
                discount.discountName && discount.discount
            ).map(discount => ({
                discountName: discount.discountName,
                discount: parseFloat(discount.discount) || 0,
                discountType: discount.discountType || 'Percentage'
            })) || [];

            // Apply general discounts to grand total
            let finalTotal = grandTotal;
            processedDiscounts.forEach(discount => {
                const discountAmount = discount.discountType === 'Percentage'
                    ? (grandTotal * discount.discount) / 100
                    : discount.discount;
                finalTotal -= discountAmount;
            });

            try {
                // Update the purchase order with all data
                await db.collection('purchasesBills').updateOne({
                    _id: purchase.insertedId,
                }, {
                    $set: {
                        invoiceNo: fields.invoiceNo,
                        invoiceDate: new Date(fields.invoiceDate),
                        supplierId: new ObjectId(fields.supplierId),
                        purchaseItems: processedItems,
                        discounts: processedDiscounts,
                        purchaseBillImages: uuidFilenames,
                        subtotal: grandTotal,
                        totalDiscount: grandTotal - finalTotal,
                        grandTotal: finalTotal,
                        totalQuantity: totalQuantity,
                        status: 'Pending',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });

                // Update inventory using bulkWrite for efficiency
                const bulkOps = processedItems.map(item => ({
                    updateOne: {
                        filter: { _id: item.productId },
                        update: { 
                            $inc: { currentStock: item.quantity },
                            $set: { updatedAt: new Date() }
                        }
                    }
                }));

                await db.collection('inventory').bulkWrite(bulkOps);

                // Create stock movement records
                const stockMovements = processedItems.map(item => ({
                    productId: item.productId,
                    type: 'in',
                    quantity: item.quantity,
                    purchasePrice: item.purchasePrice,
                    reference: 'Purchase Order',
                    referenceId: purchase.insertedId,
                    note: `Purchase from supplier - Invoice: ${fields.invoiceNo}`,
                    createdAt: new Date()
                }));

                await db.collection('stockMovements').insertMany(stockMovements);

                res.status(200).json({
                    status: "success",
                    message: 'Purchase order created successfully',
                    data: {
                        purchaseOrderId: purchase.insertedId,
                        grandTotal: finalTotal
                    }
                });
            } catch (error) {
                console.error('Database operation failed:', error);
                res.status(500).json({
                    status: "error",
                    message: 'Failed to create purchase order'
                });
            }
        });

        req.pipe(bb);
}
