import express from 'express';
import { googleAuthController, loginController, signUpController, updateUser } from '../controller/user_controller.js';
import authenticate from '../middlewares/auth.js';
const router = express.Router();

router.post('/google-auth', googleAuthController);
router.post('/login',loginController)
router.post('/signup', signUpController)
router.get('/profile', authenticate, (req, res) => {
    res.json(req.user);
  });
router.put('/update',authenticate,updateUser)
export default router;