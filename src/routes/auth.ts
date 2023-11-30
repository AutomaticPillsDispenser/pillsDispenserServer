import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'
const router = express.Router()
import User from '../models/auth/auth'
import ResetPassword from '../models/resetPassword/ResetPassword'
import { validateCreateAccount, validateLogin } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ""
const SECRET_LOGIN_KEY = process.env.SECRET_LOGIN_KEY || ""

const config = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'siddharthaghimire@gmail.com',
        pass: 'nrfbehjqyrskcqcm'
    }
}
function send(data: any) {
    const transporter = nodemailer.createTransport(config);
    transporter.sendMail(data, (err, info) => {
        if (err) {
            console.log(err)
        }
    })
}

interface AuthenticatedRequest extends Request {
    user?: typeof User; // Add the user property to Request
}
router.get("/",async (req: Request, res: Response)=>{
    res.json({message:'Hit'})
} )

export default router