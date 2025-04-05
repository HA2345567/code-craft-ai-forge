
import React from 'react';

const CodePreview = () => {
  return (
    <div className="code-block h-96 overflow-y-auto">
      <pre>
        <code>
          <div className="code-line">const express = require(&apos;express&apos;);</div>
          <div className="code-line">const mongoose = require(&apos;mongoose&apos;);</div>
          <div className="code-line">const app = express();</div>
          <div className="code-line">const PORT = process.env.PORT || 3000;</div>
          <div className="code-line"></div>
          <div className="code-line">// Middleware</div>
          <div className="code-line">app.use(express.json());</div>
          <div className="code-line"></div>
          <div className="code-line">// Connect to MongoDB</div>
          <div className="code-line">mongoose.connect(&apos;mongodb://localhost:27017/myapp&apos;, {'{'}</div>
          <div className="code-line">  useNewUrlParser: true,</div>
          <div className="code-line">  useUnifiedTopology: true</div>
          <div className="code-line">{'}'});</div>
          <div className="code-line"></div>
          <div className="code-line">// Product Schema</div>
          <div className="code-line">const productSchema = new mongoose.Schema({'{'}</div>
          <div className="code-line">  name: {'{'} type: String, required: true {'}'},</div>
          <div className="code-line">  description: {'{'} type: String {'}'},</div>
          <div className="code-line">  price: {'{'} type: Number, required: true {'}'},</div>
          <div className="code-line">  stock: {'{'} type: Number, default: 0 {'}'},</div>
          <div className="code-line">  category: {'{'} type: String {'}'},</div>
          <div className="code-line">{'}'}, {'{'} timestamps: true {'}'});</div>
          <div className="code-line"></div>
          <div className="code-line">const Product = mongoose.model(&apos;Product&apos;, productSchema);</div>
          <div className="code-line"></div>
          <div className="code-line">// Routes</div>
          <div className="code-line">app.get(&apos;/api/products&apos;, async (req, res) {'=>'} {'{'}</div>
          <div className="code-line">  try {'{'}</div>
          <div className="code-line">    const products = await Product.find();</div>
          <div className="code-line">    res.json(products);</div>
          <div className="code-line">  {'}'} catch (error) {'{'}</div>
          <div className="code-line">    res.status(500).json({'{'} error: error.message {'}'});</div>
          <div className="code-line">  {'}'}</div>
          <div className="code-line">{'}'});</div>
          <div className="code-line"></div>
          <div className="code-line">app.post(&apos;/api/products&apos;, async (req, res) {'=>'} {'{'}</div>
          <div className="code-line">  try {'{'}</div>
          <div className="code-line">    const product = new Product(req.body);</div>
          <div className="code-line">    await product.save();</div>
          <div className="code-line">    res.status(201).json(product);</div>
          <div className="code-line">  {'}'} catch (error) {'{'}</div>
          <div className="code-line">    res.status(400).json({'{'} error: error.message {'}'});</div>
          <div className="code-line">  {'}'}</div>
          <div className="code-line">{'}'});</div>
          <div className="code-line"></div>
          <div className="code-line">app.listen(PORT, () {'=>'} {'{'}</div>
          <div className="code-line">  console.log(`Server running on port ${'{'}PORT{'}'}`);  </div>
          <div className="code-line">{'}'});</div>
        </code>
      </pre>
    </div>
  );
};

export default CodePreview;
