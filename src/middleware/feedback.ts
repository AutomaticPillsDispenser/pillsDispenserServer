import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ""

export function authenticateToken(req: any, res: Response, next: Function) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET_KEY, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        req.user = user; // Set the user object in the request for further use
        next();
    });
}