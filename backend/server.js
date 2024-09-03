import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import connectDB from './database/db.js';
import jwt from 'jsonwebtoken';
import {User} from './models/user_entity.js';
import cors from 'cors'
import productRouter from './routes/productRoutes.js';
const client = new OAuth2Client();
const app = express();
const PORT = 5000; // Ensure this matches the port in app.listen
const JWT_SECRET = 'prasanna';

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // or the frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    credentials: true, 
}));
app.get('/', (req, res) => {
    res.send('Hello');
});
app.use("/api", productRouter);


app.post("/google-auth", async (req, res) => {
    const { credential, client_id } = req.body;
    console.log(credential);
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        const { email, given_name, family_name } = payload;
        console.log(email,given_name,family_name);
        
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
        res.status(200)
            .cookie('token', token, { httpOnly: true })
            .json({ payload });
    } catch (error) {
        console.error('Error in Google authentication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
