import express from 'express';
import { googleAuthController } from '../controller/user_controller.js';

const router = express.Router();

router.post('/google-auth', googleAuthController);

export default router;