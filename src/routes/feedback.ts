import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express';
const router = express.Router()
import { authenticateToken } from '../middleware/feedback';
import Feedback from '../models/feedback/feedback'


router.post('/sendFeedback', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { name, phoneNumber, review, userId } = req.body;

        // Create a new feedback instance
        const feedback = new Feedback({
            name,
            phoneNumber,
            review,
            userId,
            date: new Date().toISOString(), // You might want to use a library like moment.js for better date formatting
        });

        await feedback.save();

        console.log('Feedback saved:', feedback);
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
export default router