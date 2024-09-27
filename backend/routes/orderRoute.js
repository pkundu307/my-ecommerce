import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder, 
  getKey,
  createOnlineOrder
} from '../controller/order_contrller.js'; // Use .js extension with ES modules
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.post('/new',authenticate, createOrder);
router.get('/orders/user',authenticate, getUserOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);
router.get('/getkey',authenticate,getKey)
router.post('/onlinepay',authenticate,createOnlineOrder)
export default router;
