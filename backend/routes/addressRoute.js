import express from 'express';
import { addAddress, deleteAddress, getAllAddresses, updateAddress } from '../controller/address_controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router()

router.post('/add',authenticate ,addAddress)
router.delete('/:id', authenticate, deleteAddress); // Delete address by ID
router.put('/:id', authenticate, updateAddress); // Update address by ID
router.get('/', authenticate, getAllAddresses); // Get all addresses for the authenticated user




export default router;