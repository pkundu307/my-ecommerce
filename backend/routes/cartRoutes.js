import express from 'express';
import {addToCart} from '../controller/cart_controller.js'
import authenticate from '../middlewares/auth.js';

const router = express.Router();
//  /products is already added in base path
router.post('/add', authenticate,addToCart)


export default router;
