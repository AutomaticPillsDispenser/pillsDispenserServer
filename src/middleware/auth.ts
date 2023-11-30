import validator from 'validator'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import { Document } from 'mongoose';
import User from '../models/auth/auth';


interface AuthenticatedRequest extends Request {
    user?: Document & { email: string; password: string; appleId: string; username: string; verified: boolean; date: string; };
}

//Validator Middleware
export const validateCreateAccount = async (req: Request, res: Response, next: Function) => {
    const { email, password, username } = req.body;
    console.log(email, password, username)
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    if (password.length <= 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (username.length <= 4) {
        return res.status(400).json({ error: 'Username must be at least 5 characters long' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    next();
};

export const validateLogin = async (req: any, res: Response, next: Function) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, verified: true });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.user = user; // Attach user object to the request for later use in the route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
