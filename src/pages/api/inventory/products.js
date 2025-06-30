import connectToDatabase from "../db_conn";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { search, limit = 50 } = req.query;
        const db = await connectToDatabase();

        let filter = { isActive: true };
        
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await db.collection("inventory")
            .find(filter)
            .project({
                _id: 1,
                productName: 1,
                sku: 1,
                unit: 1,
                currentStock: 1,
                avgPurchasePrice: 1
            })
            .limit(parseInt(limit))
            .sort({ productName: 1 })
            .toArray();

        return res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Failed to fetch products' });
    }
} 