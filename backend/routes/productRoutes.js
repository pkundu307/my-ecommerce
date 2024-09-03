import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProductsByName, bulkInsertProducts } from '../controller/product_controller.js';
import express from 'express';

const router = express.Router();

// Define product-related routes
router.post('/products', addProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.get('/products/search', searchProductsByName);
router.post('/products/bulk', bulkInsertProducts); // Add route for bulk insert


export default router;
