const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Connect to MongoDB
async function connectToMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(dbName);
}

app.get('/api/deals', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const products = db.collection('products');

        // Query for items with a discount, sorted by sales_rank
        const dealItems = await products.find({
            discount: { $exists: true, $ne: null } // Ensure discount field exists and is not null
        })
        .sort({ sales_rank: 1 }) // Sort by sales_rank in ascending order
        .limit(8) // Limit to 8 items
        .toArray();

        // Map the results to match the frontend's expected format
        const formattedItems = dealItems.map(item => {
            const hasDiscount = item.discount !== item.price; // Check if there's a valid discount
            return {
                imgSrc: item.image_urls?.[0] || 'default-image-url.png', // Use the first image URL or a fallback
                title: item.name || 'No Title',
                price: item.price ? `$${item.price.toFixed(2)}` : '$0.00', // Format price or provide a default
                discount: hasDiscount ? `$${item.discount.toFixed(2)}` : "", // Format discount or set to empty string
                percent: hasDiscount ? 
                    `${Math.round(((item.discount - item.price) / item.discount) * 100)}% OFF` : "" // Calculate discount percentage or set to empty string
            };
        });

        // Fill empty spots with a placeholder item (if needed)
        while (formattedItems.length < 8) {
            formattedItems.push({
                imgSrc: 'icons/thxforsupport.png',
                title: 'Coming Soon!',
                price: '<3',
                discount: "",
                percent: ""
            });
        }

        // Send the formatted items as the response
        res.json(formattedItems);
    } catch (error) {
        console.error('Error fetching deal items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
        console.error('Error fetching deal items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});