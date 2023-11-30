import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import feedbackRouter from './routes/feedback.ts'
import travelRecord from './routes/travelRecord.ts'
import reportRecord from './routes/report.ts'
import authRouter from './routes/auth.ts'
import connectDatabase from './config/databaseConnection.ts'
const app = express();
const port = process.env.PORT;


connectDatabase()
app.use(express.json({ limit: '10mb' })); // Set the limit to 10 megabytes (adjust as needed)
app.listen(port, () => {
    console.log(`[Server]: Running at http://localhost:${port}`);
});
app.get("/", (req, res) => {
    res.json({ message: 'Sid' })
})

app.use('/auth', authRouter)
app.use('/feedback', feedbackRouter)
app.use('/travelRecord', travelRecord)
app.use('/report', reportRecord)