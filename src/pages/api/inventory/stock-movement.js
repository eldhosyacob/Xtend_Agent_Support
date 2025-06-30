import connectToDatabase from "../db_conn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const {
            productId,
            type, // 'in' or 'out'
            quantity,
            supplier,
            purchasePrice,
            batchNo,
            expiryDate,
            location,
            note
        } = req.body;

        if (!productId || !type || !quantity) {
            return res.status(400).json({ message: 'Product, type, and quantity are required' });
        }

        const db = await connectToDatabase();
        const session = db.client.startSession();

        try {
            await session.withTransaction(async () => {
                // Get current product
                const product = await db.collection("inventory").findOne(
                    { _id: new ObjectId(productId) },
                    { session }
                );

                if (!product) {
                    throw new Error('Product not found');
                }

                // Calculate new stock
                const quantityChange = type === 'in' ? parseInt(quantity) : -parseInt(quantity);
                const newStock = Math.max(0, product.currentStock + quantityChange);

                // Update average purchase price if it's a stock-in with purchase price
                let updateData = {
                    currentStock: newStock,
                    updatedAt: new Date()
                };

                if (type === 'in' && purchasePrice) {
                    const totalCost = (product.currentStock * product.avgPurchasePrice) + 
                                    (parseInt(quantity) * parseFloat(purchasePrice));
                    const totalQuantity = product.currentStock + parseInt(quantity);
                    updateData.avgPurchasePrice = totalQuantity > 0 ? totalCost / totalQuantity : parseFloat(purchasePrice);
                }

                if (location) {
                    updateData.location = location;
                }

                if (expiryDate) {
                    updateData.expiryDate = new Date(expiryDate);
                }

                // Update inventory
                await db.collection("inventory").updateOne(
                    { _id: new ObjectId(productId) },
                    { $set: updateData },
                    { session }
                );

                // Create stock movement record
                const stockMovement = {
                    productId: new ObjectId(productId),
                    type,
                    quantity: parseInt(quantity),
                    supplier: supplier || '',
                    purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
                    batchNo: batchNo || '',
                    location: location || product.location,
                    note: note || '',
                    previousStock: product.currentStock,
                    newStock: newStock,
                    createdAt: new Date(),
                    createdBy: req.user?.id || null // Assuming user info is available in req
                };

                await db.collection("stockMovements").insertOne(stockMovement, { session });
            });

            return res.status(200).json({ message: 'Stock movement recorded successfully' });
        } finally {
            await session.endSession();
        }
    } catch (error) {
        console.error('Error recording stock movement:', error);
        return res.status(500).json({ message: error.message || 'Failed to record stock movement' });
    }
} 