import express from 'express';
import { AddAddress } from '../controller/address_controller.js';
const router = express.Router()

router.post('/add',AddAddress)




export default router;