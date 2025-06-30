import connectToDatabase from "../db_conn";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const {
            productName,
            sku,
            barcode,
            category,
            unit,
            currentStock,
            lowStockThreshold,
            avgPurchasePrice,
            sellingPrice,
            location,
            expiryDate,
            description
        } = req.body;

        if (!productName || !sku || !category || !unit) {
            return res.status(400).json({ 
                message: 'Product name, SKU, category, and unit are required' 
            });
        }

        const db = await connectToDatabase();

        // Check if SKU or barcode already exists
        const existingProduct = await db.collection("inventory").findOne({
            $or: [
                { sku: sku },
                ...(barcode ? [{ barcode: barcode }] : [])
            ]
        });

        if (existingProduct) {
            return res.status(409).json({ 
                message: 'Product with this SKU or barcode already exists' 
            });
        }

        const newProduct = {
            productName,
            sku,
            barcode: barcode || '',
            category,
            unit,
            currentStock: parseInt(currentStock) || 0,
            lowStockThreshold: parseInt(lowStockThreshold) || 10,
            avgPurchasePrice: parseFloat(avgPurchasePrice) || 0,
            sellingPrice: parseFloat(sellingPrice) || 0,
            location: location || 'Main Store',
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            description: description || '',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("inventory").insertOne(newProduct);

        return res.status(201).json({
            message: 'Product added successfully',
            productId: result.insertedId
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Failed to add product' });
    }
} 