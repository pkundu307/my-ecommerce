import express from 'express';
import {addToCart,fetchCartByUser,deleteFromCart,updateCart, clearCart} from '../controller/cart_controller.js'
import authenticate from '../middlewares/auth.js';

const router = express.Router();
//  /products is already added in base path
router.post('/add', authenticate,addToCart)
router.get('/cart',authenticate, fetchCartByUser);
router.delete('/delete/:productId', authenticate, deleteFromCart);
router.put('/cart/:productId', authenticate, updateCart);
router.put('/clear', authenticate,clearCart)

export default router;
