import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt'
const router = express.Router()
import User from '../models/auth/auth.js'
import ResetPassword from '../models/resetPassword/ResetPassword.js'
import { validateCreateAccount, validateLogin } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ""
const SECRET_LOGIN_KEY = process.env.SECRET_LOGIN_KEY || ""
const URL=process.env.SERVER_URL || ""

const config = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
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

router.post('/createAccount', validateCreateAccount, async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
        const newUser = new User({
            email, password: hashedPassword, username, verified: false,
            date: new Date().toISOString()
        });
        const savedUser = await newUser.save();
        const userResponse = {
            _id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,

        };
        const mailOptions = {
            from: 'siddharthaghimire@gmail.com',
            to: email,
            subject: 'Email Verification',
            html: `<p>Click the following link to verify your email: <a href="${URL}/auth/verify/${savedUser._id}">Verify Email</a></p>`
        };
        send(mailOptions)
        res.json(userResponse);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/login', validateLogin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user: any = req.user;
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
        res.json({ token, email: user.email, username: user.username, id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/loginWithGoogle', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, email } = req.body;
        console.log(username, email)
        // Check if the user with the provided email already exists
        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await bcrypt.hash(SECRET_LOGIN_KEY, 10); // 10 is the number of salt rounds

            // If the user doesn't exist, create a new account
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                date: new Date(), // Replace with the actual date logic you want to use
                verified: true, // Assuming you want to set it to true for Google login
            });

            user = await newUser.save();
        }
        console.log(user)
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

        // Respond with token and user details
        res.json({ token, email: user.email, username: user.username, id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/loginWithApple', async (req: Request, res: Response) => {
    try {
        const { username, userId, identityToken } = req.body;
        const jwtToken = jwt.decode(identityToken) as { email?: string } | null; // Type assertion

        let email = '';

        if (jwtToken != null && typeof jwtToken == 'object') {
            if (jwtToken.email) {
                email = jwtToken.email;
            }
        }
        let user = await User.findOne({ email });
        let token = ''
        if (!user) {

            const hashedPassword = await bcrypt.hash(SECRET_LOGIN_KEY, 10); // 10 is the number of salt rounds
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                date: new Date(), // Replace with the actual date logic you want to use
                verified: true, // Assuming you want to set it to true for Google login
            });

            user = await newUser.save();
            token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

        } else {
            token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });

        }
        // Generate JWT token

        // Respond with token and user details
        res.json({ token, email: user.email, username: user.username, id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/verify/:userId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.params.userId;
        const updateUser = await User.updateOne({ _id: userId }, { verified: true })
        res.status(200).json({ message: 'Success' })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const { email } = req.body;

        // Generate and update the OTP for the user
        const { newOTP } = await generateAndUpdateOTP(email);

        // Compose the email data
        const emailData = {
            from: 'siddharthaghimire@gmail.com',
            to: email, // Use the email from the database
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${newOTP}`,
        };


        // Send the email
        send(emailData);

        res.status(200).json({ message: 'OTP sent successfully', newOTP });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/changePassword', async (req, res) => {
    try {
        const { password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Update the password in the User schema and capture the document before the update
        const userBeforeUpdate = await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Access the user ID from the document before the update
        const userId = userBeforeUpdate ? userBeforeUpdate._id : null;

        // Remove the corresponding ResetPassword collection
        await ResetPassword.deleteOne({ userId });

        res.status(200).json({ message: 'Password Changed Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
async function generateAndUpdateOTP(email: string) {
    try {
        // Find the user by email in the User schema
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if a ResetPassword record already exists for the user
        let resetPasswordUser = await ResetPassword.findOne({ userId: user._id });

        // If a ResetPassword record doesn't exist, create a new one
        if (!resetPasswordUser) {
            resetPasswordUser = new ResetPassword({
                lastOTP: generateOTP(),
                userId: user._id,
                date: new Date().toISOString(), // You may need to adjust the date format based on your requirements
            });

            // Save the new ResetPassword record to the database
            await resetPasswordUser.save();
        } else {
            // Generate a new OTP
            const newOTP = generateOTP();

            // Update the lastOTP in the ResetPassword schema
            await ResetPassword.findOneAndUpdate({ userId: user._id }, { lastOTP: newOTP });
        }

        return { newOTP: resetPasswordUser.lastOTP, user };
    } catch (error) {
        console.error(error);
        throw new Error('Error generating and updating OTP');
    }
}

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}
export default router