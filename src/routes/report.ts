import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express';
const router = express.Router()
import { authenticateToken } from '../middleware/feedback.js';
import ReportRecord from '../models/report/report.js';


router.post('/sendReport', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { location, reportType, reportSubType, userId } = req.body;

        // Create a new feedback instance
        const feedback = new ReportRecord({
            location,
            reportType,
            reportSubType,
            userId,
            date: new Date().toISOString(), // You might want to use a library like moment.js for better date formatting
        });

        await feedback.save();

        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
export default router