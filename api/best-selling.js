const {MongoClient} = require('mongodb');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

async function connectToMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(dbName);
}
app.get('/api/best-selling', async (req, res) => {
    const category = req.query.category; // Get category from query parameter

    if (!category) {
        return res.status(400).json({ error: 'Category parameter is required' });
    }

    try {
        const db = await connectToMongoDB();
        const products = db.collection('products');

        // Query for top 8 items in the specified category, sorted by sales_rank
        const bestSellingItems = await products.find({
            type: category
        })
        .sort({ sales_rank: 1 }) // Sort by sales_rank in ascending order
        .limit(8) // Limit to 8 items
        .toArray();

        // Map the results to match the frontend's expected format
        const formattedItems = bestSellingItems.map(item => ({
            imgSrc: item.image_urls[0], // Use the first image URL
            title: item.name,
            price: `$${item.price.toFixed(2)}`, // Format price as a string
            discount: item.discount ? `$${item.discount.toFixed(2)}` : "", // Format discount if it exists
            percent: item.discount ? `${Math.round(((item.discount - item.price) / item.discount) * 100)}% OFF` : "" // Calculate discount percentage if discount exists
        }));

        // Fill empty spots with a placeholder item
        const placeholderItem = {
            imgSrc: "icons/thxforsupport.png",
            title: "Coming Soon!",
            price: "<3",
            discount: "",
            percent: "💜"
        };

        while (formattedItems.length < 8) {
            formattedItems.push(placeholderItem);
        }

        res.json(formattedItems);
    } catch (error) {
        console.error('Error fetching best-selling items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});