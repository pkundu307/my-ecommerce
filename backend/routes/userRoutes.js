import express from 'express';
import { googleAuthController, loginController, signUpController } from '../controller/user_controller.js';
import authenticate from '../middlewares/auth.js';
const router = express.Router();

router.post('/google-auth', googleAuthController);
router.post('/login',loginController)
router.post('/signup', signUpController)
router.get('/profile', authenticate, (req, res) => {
    res.json(req.user);
  });
export default router;