import Product from '../models/product_entity.js';
import NodeCache from 'node-cache';
const cache = new NodeCache();
// const cache = new NodeCache();
// Add a new product
export const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    cache.del('products');
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const bulkInsertProducts = async (req, res) => {
  try {
    const products = req.body; // No need to check for sku or slug since they've been removed
    const insertedProducts = await Product.insertMany(products);
    res.status(201).json(insertedProducts);

    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    // Check if the products are already cached
    const cachedProducts = cache.get('products');
    if (cachedProducts) {
      return res.status(200).json(cachedProducts);
    }

    // Fetch products if not cached
    const products = await Product.find({ deleted: false })
      .select('id thumbnail price title')
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Store the products in cache
    cache.set('products', products);

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    cache.del('products');
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product || product.deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    cache.del('products');
    const product = await Product.findById(req.params.id);
    if (!product || product.deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    product.deleted = true;
    product.deletedAt = new Date();
    await product.save();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search products by starting name
export const searchProductsByName = async (req, res) => {
  try {
    const name = req.query.name || "";
    const products = await Product.find({
      title: { $regex: `^${name}`, $options: "i" },
      deleted: false
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
