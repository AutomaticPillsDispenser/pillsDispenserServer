import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import feedbackRouter from './src/routes/feedback.js'
import travelRecord from './src/routes/travelRecord.js'
import reportRecord from './src/routes/report.js'
import authRouter from './src/routes/auth.js'
import connectDatabase from './src/config/databaseConnection.js'
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

//app.use('/auth', authRouter)
