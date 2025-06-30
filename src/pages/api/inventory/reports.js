import connectToDatabase from "../db_conn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { type, startDate, endDate, format = 'json' } = req.query;
        const db = await connectToDatabase();

        let reportData = {};

        switch (type) {
            case 'lowStock':
                reportData = await getLowStockReport(db);
                break;
            case 'valuation':
                reportData = await getValuationReport(db);
                break;
            case 'stockMovement':
                reportData = await getStockMovementReport(db, startDate, endDate);
                break;
            case 'expired':
                reportData = await getExpiredStockReport(db);
                break;
            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        if (format === 'csv') {
            // Convert to CSV format (simplified implementation)
            const csv = convertToCSV(reportData);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
            return res.status(200).send(csv);
        }

        return res.status(200).json(reportData);
    } catch (error) {
        console.error('Error generating report:', error);
        return res.status(500).json({ message: 'Failed to generate report' });
    }
}

async function getLowStockReport(db) {
    const lowStockItems = await db.collection("inventory").aggregate([
        {
            $match: {
                isActive: true,
                $expr: { $lte: ["$currentStock", "$lowStockThreshold"] }
            }
        },
        {
            $project: {
                productName: 1,
                sku: 1,
                currentStock: 1,
                lowStockThreshold: 1,
                unit: 1,
                location: 1,
                category: 1,
                stockDeficit: { $subtract: ["$lowStockThreshold", "$currentStock"] }
            }
        },
        { $sort: { stockDeficit: -1 } }
    ]).toArray();

    return {
        title: 'Low Stock Report',
        items: lowStockItems,
        totalItems: lowStockItems.length
    };
}

async function getValuationReport(db) {
    const valuationData = await db.collection("inventory").aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: "$category",
                totalQuantity: { $sum: "$currentStock" },
                totalValue: { $sum: { $multiply: ["$currentStock", "$avgPurchasePrice"] } },
                productCount: { $sum: 1 }
            }
        },
        { $sort: { totalValue: -1 } }
    ]).toArray();

    const totalInventoryValue = valuationData.reduce((sum, cat) => sum + cat.totalValue, 0);

    return {
        title: 'Inventory Valuation Report',
        categories: valuationData,
        totalValue: totalInventoryValue,
        generatedAt: new Date()
    };
}

async function getStockMovementReport(db, startDate, endDate) {
    let filter = {};
    
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const movements = await db.collection("stockMovements").aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "inventory",
                localField: "productId",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        {
            $project: {
                productName: "$product.productName",
                sku: "$product.sku",
                type: 1,
                quantity: 1,
                supplier: 1,
                location: 1,
                note: 1,
                createdAt: 1
            }
        },
        { $sort: { createdAt: -1 } }
    ]).toArray();

    return {
        title: 'Stock Movement Report',
        movements,
        totalMovements: movements.length,
        period: { startDate, endDate }
    };
}

async function getExpiredStockReport(db) {
    const expiredItems = await db.collection("inventory").find({
        isActive: true,
        expiryDate: { $lte: new Date() },
        currentStock: { $gt: 0 }
    }).project({
        productName: 1,
        sku: 1,
        currentStock: 1,
        unit: 1,
        location: 1,
        expiryDate: 1,
        avgPurchasePrice: 1
    }).sort({ expiryDate: 1 }).toArray();

    return {
        title: 'Expired Stock Report',
        items: expiredItems,
        totalItems: expiredItems.length
    };
}

function convertToCSV(data) {
    // Simplified CSV conversion
    if (!data.items && !data.movements && !data.categories) return '';
    
    const items = data.items || data.movements || data.categories || [];
    if (items.length === 0) return '';
    
    const headers = Object.keys(items[0]).join(',');
    const rows = items.map(item => Object.values(item).join(',')).join('\n');
    
    return `${headers}\n${rows}`;
} 