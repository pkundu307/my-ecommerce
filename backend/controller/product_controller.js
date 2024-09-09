import Product from '../models/product/product_entity.js';
import Review from '../models/product/review_entity.js';
import AWS from '@aws-sdk/client-s3';
import Busboy from 'busboy';
import NodeCache from 'node-cache';
import User from '../models/user_entity.js';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const cache = new NodeCache();
// const cache = new NodeCache();
// Add a new product
export const addProduct = async (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  let productData = {};
  let imageUploadPromises = [];
  let imageCount = 0;

  busboy.on('field', (fieldname, val) => {
    productData[fieldname] = val; // Collect all other form fields
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (imageCount < 3) {  // Ensure only 3 images are uploaded
      const s3Key = `${productData.title}${imageCount + 1}-${uuidv4()}`;
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: file,
        ContentType: mimetype,
        ACL: 'public-read', // Makes image publicly accessible
      };

      // Push upload promises to handle them later
      imageUploadPromises.push(
        s3.upload(uploadParams).promise().then((data) => {
          return data.Location; // Store the URL of the uploaded image
        })
      );

      imageCount++;
    } else {
      file.resume(); // Ignore files after 3
    }
  });

  busboy.on('finish', async () => {
    try {
      // Wait for all images to be uploaded to S3
      const imageUrls = await Promise.all(imageUploadPromises);
      productData.images = imageUrls; // Assign image URLs to product data

      // Create and save product
      const product = new Product(productData);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  req.pipe(busboy); // Pipe the incoming request to busboy
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