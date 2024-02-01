import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import sdkModule from 'api';
import { authenticateToken } from '../middleware/feedback';

const router = express.Router();
dotenv.config();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        console.log(message);

        // Your AI API request
        const aiApiResponse = await getAIResponse(message);

        console.log('AI API Response:', aiApiResponse);

        res.status(200).json({ aiResponse: aiApiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const getAIResponse = async (message: any) => {
    try {
        const sdk = sdkModule('@pplx/v0#cgfwhhzlrzivxql');
        const token = process.env.BEARER_TOKEN; // Get the bearer token from process environment

        // Set the authentication token
        sdk.auth(token);

        // AI API request
        const response = await sdk.post_chat_completions({
            model: 'pplx-7b-online',
            messages: [
                { role: 'system', content: 'answer accurately in 20 words' },
                { role: 'user', content: message },
            ],
            max_tokens: 60
        });

        return response.data;
    } catch (error) {
        console.error('AI API Request Error:', error);
        throw error;
    }
};

export default router;
