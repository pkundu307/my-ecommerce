import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProductsByName, bulkInsertProducts, addReview, getReviewsByProductId } from '../controller/product_controller.js';
import express from 'express';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

// Define product-related routes
router.post('/add',authenticate, addProduct);
router.delete('/products/:id', authenticate,deleteProduct);
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.get('/products/search', searchProductsByName);
router.post('/products/bulk', bulkInsertProducts); // Add route for bulk insert
router.get('/product/:id', getProductById);
router.post('/addreview/:id',authenticate, addReview);
router.get('/getreview/:id', getReviewsByProductId)

export default router;
