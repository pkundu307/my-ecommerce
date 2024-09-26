import Product from '../models/product/product_entity.js';
import Review from '../models/product/review_entity.js';
import NodeCache from 'node-cache';
import User from '../models/user_entity.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from '../utils/s3.js';

const cache = new NodeCache();
// const cache = new NodeCache();
// Add a new product
export const addProduct = async (req, res) => {
  try {
  
    const { title, description, price, stock, brand, category } = req.body;
    console.log(title, description, price, stock, category);
    
    let thumbnailUrl = '';
    let imageUrls = [];

    // Upload thumbnail if provided
    if (req.files?.thumbnail) {
      const thumbnailFile = req.files.thumbnail;
      const thumbnailFileName = title;
      thumbnailUrl = await uploadToS3(thumbnailFile.data, thumbnailFileName);
    }

    // Upload additional images if provided
    if (req.files?.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of images) {
        const imageFileName = `${uuidv4()}_${image.name}`;
        const imageUrl = await uploadToS3(image.data, imageFileName);
        imageUrls.push(imageUrl);
      }
    }

    // Create product
    const product = new Product({
      title,
      description,
      price,
      stock,
      brand,
      category,
      thumbnail: thumbnailUrl,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product', error);
    res.status(500).json({ message: 'Error creating product', error });
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
    const product = await Product.findById(req.params.id).populate('reviews');

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
    const { productId } = req.params;
    const { title, description, price, stock, brand, category } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let thumbnailUrl = product.thumbnail;
    let imageUrls = product.images;

    // Upload new thumbnail if provided
    if (req.files?.thumbnail) {
      const thumbnailFile = req.files.thumbnail;
      const thumbnailFileName = `${uuidv4()}_${thumbnailFile.name}`;
      thumbnailUrl = await uploadToS3(thumbnailFile.data, thumbnailFileName);
    }

    // Upload new images if provided
    if (req.files?.images) {
      imageUrls = []; // Reset the images array
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of images) {
        const imageFileName = `${uuidv4()}_${image.name}`;
        const imageUrl = await uploadToS3(image.data, imageFileName);
        imageUrls.push(imageUrl);
      }
    }

    // Update product fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.thumbnail = thumbnailUrl;
    product.images = imageUrls;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ message: 'Error updating product', error });
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



export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id; // Get the productId from URL parameter
    const userId = req.user._id;

    // Create a new review
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    // Save the review
    await review.save();

    // Find the product and add the review to the product's review array
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getReviewsByProductId = async (req, res) => {


  try {
    const product = await Product.findById(req.params.id).select('title').populate('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }


    // Fetch user details for each review
    const reviewsWithUserNames = await Promise.all(
      product.reviews.map(async (review) => {
        const user = await User.findById(review.user);
        return {
          ...review.toObject(),
          user: user ? user.name : 'Unknown User',
        };
      })
    );

    res.status(200).json({
      ...product.toObject(),
      reviews: reviewsWithUserNames,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};