
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CodePreview = () => {
  const [activeFile, setActiveFile] = useState('server');

  return (
    <div className="code-preview h-[500px] overflow-hidden flex flex-col">
      <Tabs value={activeFile} onValueChange={setActiveFile} className="w-full">
        <div className="border-b border-white/10 bg-black/40 p-2">
          <TabsList className="bg-secondary/40 grid w-full grid-cols-4 h-9">
            <TabsTrigger value="server" className="text-xs">server.js</TabsTrigger>
            <TabsTrigger value="models" className="text-xs">product.model.js</TabsTrigger>
            <TabsTrigger value="routes" className="text-xs">product.routes.js</TabsTrigger>
            <TabsTrigger value="controller" className="text-xs">product.controller.js</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="overflow-y-auto h-full">
          <TabsContent value="server" className="mt-0 p-0">
            <pre className="language-javascript p-4 text-sm font-mono">
              <code>{serverJs}</code>
            </pre>
          </TabsContent>
          <TabsContent value="models" className="mt-0 p-0">
            <pre className="language-javascript p-4 text-sm font-mono">
              <code>{productModel}</code>
            </pre>
          </TabsContent>
          <TabsContent value="routes" className="mt-0 p-0">
            <pre className="language-javascript p-4 text-sm font-mono">
              <code>{productRoutes}</code>
            </pre>
          </TabsContent>
          <TabsContent value="controller" className="mt-0 p-0">
            <pre className="language-javascript p-4 text-sm font-mono">
              <code>{productController}</code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end items-center p-2 border-t border-white/10 bg-black/40">
        <Button variant="outline" size="sm">Run in Sandbox</Button>
      </div>
    </div>
  );
};

const serverJs = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/product.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

const productModel = `const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  category: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Add virtual property for availability
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

// Add pre-save middleware
productSchema.pre('save', function(next) {
  // Ensure price is not negative
  if (this.price < 0) {
    this.price = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;`;

const productRoutes = `const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET all products
router.get('/', productController.getAllProducts);

// GET single product by ID
router.get('/:id', productController.getProductById);

// POST new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;`;

const productController = `const Product = require('../models/product.model');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    // Support for query parameters like limit, sort, etc.
    const { limit = 10, sort = 'createdAt', category } = req.query;
    
    // Build query
    let query = {};
    if (category) query.category = category;
    
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit));
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`;

export default CodePreview;
