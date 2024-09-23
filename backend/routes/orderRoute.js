import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder 
} from '../controller/order_contrller.js'; // Use .js extension with ES modules

const router = express.Router();

router.post('/new', createOrder);
router.get('/orders/user/:userId', getUserOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

export default router;
