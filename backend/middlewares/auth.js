import jwt from 'jsonwebtoken';
import User from '../models/user_entity.js';  // Adjust the path to your User model

const authenticate = async (req, res, next) => {
  // Get the token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify the token using the secret
    const decodedToken = jwt.verify(token, 'prasanna');  // Ensure the secret matches the one used during signing
    console.log(decodedToken,'aaaa');
    
    // Find the user based on the decoded token's userId
    const user = await User.findById(decodedToken.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user to the request object for later use
    req.user = user;

    // Move to the next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticate;
