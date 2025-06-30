import connectToDatabase from "../db_conn";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();

        // Get inventory summary statistics
        const totalProducts = await db.collection("inventory").countDocuments({ isActive: true });
        
        const stockStats = await db.collection("inventory").aggregate([
            { $match: { isActive: true } },
            {
                $addFields: {
                    stockStatus: {
                        $cond: [
                            { $lte: ["$currentStock", 0] }, 
                            "outOfStock",
                            {
                                $cond: [
                                    { $lte: ["$currentStock", "$lowStockThreshold"] },
                                    "lowStock",
                                    "inStock"
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$stockStatus",
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // Calculate inventory value
        const inventoryValue = await db.collection("inventory").aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalValue: { 
                        $sum: { 
                            $multiply: ["$currentStock", "$avgPurchasePrice"] 
                        } 
                    }
                }
            }
        ]).toArray();

        // Get recent stock movements (last 10)
        const recentMovements = await db.collection("stockMovements").aggregate([
            {
                $lookup: {
                    from: "inventory",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
                $project: {
                    productName: "$product.productName",
                    type: 1,
                    quantity: 1,
                    date: "$createdAt",
                    note: 1,
                    supplier: 1
                }
            }
        ]).toArray();

        // Format stock stats
        const stats = {
            inStock: stockStats.find(s => s._id === "inStock")?.count || 0,
            lowStock: stockStats.find(s => s._id === "lowStock")?.count || 0,
            outOfStock: stockStats.find(s => s._id === "outOfStock")?.count || 0
        };

        const totalValue = inventoryValue[0]?.totalValue || 0;

        return res.status(200).json({
            stats,
            inventoryValue: totalValue,
            recentMovements
        });
    } catch (error) {
        console.error('Error fetching inventory dashboard:', error);
        return res.status(500).json({ message: 'Failed to fetch inventory data' });
    }
} 