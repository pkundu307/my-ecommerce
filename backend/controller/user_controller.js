import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user_entity.js';
// dotenv.config()

const client = new OAuth2Client('939883123761-up76q4mal36sd3quh558ssccr1cqc035.apps.googleusercontent.com');
const JWT_SECRET = 'prasanna';

export const googleAuthController = async (req, res) => {
  const { credential, client_id } = req.body;
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload; // Destructure picture
    
    let user = await User.findOne({ email });
    if (!user) {
      // Create a user if they do not exist
      user = await User.create({
        email,
        name: `${given_name} ${family_name}`,
        picture, // Save picture in the database
        authSource: 'google',
      });
    } else {
      // Update the user's profile picture if it has changed
      user.picture = picture;
      console.log(user);
      
      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign({user}, "prasanna");

    // Send back the user (with picture) and token in the response body
    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error in Google authentication:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

