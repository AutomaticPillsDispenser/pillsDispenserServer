import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express';
const router = express.Router()
import { authenticateToken } from '../middleware/feedback.js';
import TravelRecord from '../models/travelRecord/travelRecord.js'

TravelRecord.schema.index({ userId: 1, selectedLocation: 1 }, { unique: true });

router.post('/storeRecord', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { userId, selectedLocation } = req.body;

        // Create a new feedback instance
        const feedback = new TravelRecord({
            userId,
            selectedLocation,
            date: new Date().toISOString(), // You might want to use a library like moment.js for better date formatting
        });

       await feedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/getUserRecord', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'userId is required in the request body' });
        }
        const records = await TravelRecord.find({ userId })
            .sort({ date: -1 })
            .limit(10);
        if (records.length === 0) {
            return res.status(404).json({ message: 'No records found for the specified user' });
        }
        res.status(200).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router