const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.static(path.join(__dirname, '..'))); // Root static files

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Schema 
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image_urls: [String], // Changed from Array to [String] for clarity
  related_items: [Number], // Assuming these are product IDs
  type: String,
  sales_rank: Number,
  flavor: String
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Temporarily modify your route to log data
app.get('/keyboards', async (req, res) => {
    try {
      const keyboards = await Product.find({ type: 'keyboard' });
      console.log('First product:', keyboards[0]); // Check data structure
      res.render('keyboards', { type: keyboards });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).send('Server Error');
    }
  });
  app.get('/keycaps', async (req, res) => {
    try {
      // 1. Fetch real data from MongoDB
      const keycaps = await Product.find({ type: 'keycaps' });
      
      // 2. Render the same template but with real data
      res.render('keycaps', { 
        products: keycaps });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).render('error', { message: "Failed to load keycaps" });
    }
  });
  // Add this temporary route above all others
app.get('/test-keycaps', (req, res) => {
    res.render('keycaps', { 
      products: [{ 
        name: "TEST Keycap", 
        price: 29.99,
        discount: 22.99,
        image_urls: ["/test-image.jpg"] 
      }]
    });
  });

// Static file routes - Fixed to point to correct directories
app.use('/bundles', express.static(path.join(__dirname, '../bundles')));
app.use('/deskmats', express.static(path.join(__dirname, '../deskmats')));
app.use('/keycaps', express.static(path.join(__dirname, '../keycaps')));
app.use('/keyboards', express.static(path.join(__dirname, '../keyboards')));

// Policy pages (assuming these are HTML files)
app.use('/privacy-policy', express.static(path.join(__dirname, '../policies')));
app.use('/refund-policy', express.static(path.join(__dirname, '../policies')));
app.use('/terms-of-service', express.static(path.join(__dirname, '../policies')));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});