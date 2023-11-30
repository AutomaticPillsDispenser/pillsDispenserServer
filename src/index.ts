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
import expressWs from 'express-ws'
import Houndify from 'houndify'

const { createReactNativeProxy } = Houndify.HoundifyExpress

expressWs(app)
connectDatabase()
app.use(express.json({ limit: '10mb' })); // Set the limit to 10 megabytes (adjust as needed)
app.listen(port, () => {
    console.log(`[Server]: Running at http://localhost:${port}`);
});

const clientId = "MPrEmLeNLO68z_JIbApPyA==";
const clientSecret = "D5jEG9YiNI8Osdlc89_ZEz5sLFngOrfxTFv7ZMkHeCiiJpNZa3e_kEAwj0tCrdqvdncG8EDUaXK1f8ZA42ig0A==";

if (!clientId || !clientSecret) {
    console.log("No ClientId or ClientSecret provided!!");
    process.exit();
}

app.use(
    "/houndifyReactNativeProxy",
    createReactNativeProxy(express, clientId, clientSecret)
);

app.use('/auth', authRouter)
app.use('/feedback', feedbackRouter)
app.use('/travelRecord', travelRecord)
app.use('/report', reportRecord)