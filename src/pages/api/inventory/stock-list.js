import connectToDatabase from "../db_conn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { search, category, status, page = 1, limit = 10 } = req.query;
        const db = await connectToDatabase();

        // Build filter query
        let filter = {};
        
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
                { barcode: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (status) {
            if (status === 'active') {
                filter.isActive = true;
            } else if (status === 'inactive') {
                filter.isActive = false;
            } else if (status === 'lowStock') {
                filter.$expr = { $lte: ["$currentStock", "$lowStockThreshold"] };
                filter.isActive = true;
            } else if (status === 'outOfStock') {
                filter.currentStock = { $lte: 0 };
                filter.isActive = true;
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count
        const totalCount = await db.collection("inventory").countDocuments(filter);

        // Get paginated results
        const products = await db.collection("inventory")
            .find(filter)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .project({
                productName: 1,
                sku: 1,
                currentStock: 1,
                unit: 1,
                expiryDate: 1,
                location: 1,
                category: 1,
                avgPurchasePrice: 1,
                lowStockThreshold: 1,
                isActive: 1,
                updatedAt: 1
            })
            .toArray();

        // Add stock status to each product
        const productsWithStatus = products.map(product => ({
            ...product,
            stockStatus: product.currentStock <= 0 ? 'outOfStock' :
                        product.currentStock <= product.lowStockThreshold ? 'lowStock' : 'inStock'
        }));

        return res.status(200).json({
            products: productsWithStatus,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit))
        });
    } catch (error) {
        console.error('Error fetching stock list:', error);
        return res.status(500).json({ message: 'Failed to fetch stock list' });
    }
} 