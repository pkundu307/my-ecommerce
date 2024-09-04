import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user_entity.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = 'prasanna';

export const googleAuthController = async (req, res) => {
    const { credential, client_id } = req.body;
    console.log(credential);

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });

        const payload = ticket.getPayload();
        const { email, given_name, family_name } = payload;
        console.log(email, given_name, family_name);

        let user = await User.findOne({ email });
        if (!user) {
            // Create a user if they do not exist
            user = await User.create({
                email,
                name: `${given_name} ${family_name}`,
                authSource: 'google',
            });
        }

        // Generate a JWT token
        const token = jwt.sign({ user }, JWT_SECRET);
        
        // Send the token in the response body
        res.status(200).json({ token, user});
    } catch (error) {
        console.error('Error in Google authentication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
