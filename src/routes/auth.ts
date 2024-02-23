import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import User from "../models/auth/auth.js";
import ResetPassword from "../models/resetPassword/ResetPassword.js";
import { validateCreateAccount, validateLogin } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const SECRET_LOGIN_KEY = process.env.SECRET_LOGIN_KEY || "";
const URL = process.env.SERVER_URL || "";

export const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "maps.native3@gmail.com",
    pass: "mpawyscspjnrfnjn ",
  },
};
export function send(data: any) {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
}

interface AuthenticatedRequest extends Request {
  user?: typeof User; // Add the user property to Request
}
router.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Hit" });
});

router.post(
  "/createAccount",
  validateCreateAccount,
  async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        verified: false,
        date: new Date().toISOString(),
      });
      const savedUser = await newUser.save();
      const userResponse = {
        _id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      };

      const mailOptions = {
        from: "maps.native3@gmail.com",
        to: email,
        subject: "Email Verification",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
        
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
        
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
        
          img {
            -ms-interpolation-mode: bicubic;
          }
        
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
         
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>
        
        </head>
        <body style="background-color: #e9ecef;">
        
          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            Email Verification for creating a new account in Native Maps
          </div>
        
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
            <tr>
              <td align="center" bgcolor="#e9ecef">
            
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" valign="top" style="padding: 36px 24px;">
                      <a href="https://www.mapsnative.com" target="_blank" style="display: inline-block;">
                        <img src="https://raw.githubusercontent.com/NativeMap/svgImages/main/assets/images/roundedProfile.png" alt="Logo" border="0" width="80" style="display: block; width: 80px; max-width: 80px; min-width: 80px;">
                      </a>
                    </td>
                  </tr>
                </table>
        
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://mapsnative.com">Native Maps</a>, you can safely delete this email.</p>
                    </td>
                  </tr>
        
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                  <a href="${URL}/auth/verify/${savedUser._id}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
          
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                      <p style="margin: 0;"><a href="${URL}/auth/verify/${savedUser._id}" target="_blank">${URL}/auth/verify/${savedUser._id}</a></p>
                    </td>
                  </tr>
         
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br> Native Maps</p>
                    </td>
                  </tr>
                </table>
        
              </td>
            </tr>
        
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
        
                </table>
              </td>
            </tr>
        
          </table>
        
        </body>
        </html>
        `,
      };
      try {
        await addToStrapi(email, username);
      } catch (e) {}
      send(mailOptions);
      res.json(userResponse);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/login",
  validateLogin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user: any = req.user;
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      res.json({
        token,
        email: user.email,
        username: user.username,
        id: user._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
async function addToStrapi(email: any, username: any) {
  const apiUrl =
    "https://strapi-production-110d.up.railway.app" + "/api/waitlists";
  const token =
    "58c5c53a4dc72b4937a4041846f6547a69956f088f6f67399e7d5a21a357c18d88c7902a56f2061700b8956b51f044850cc02e9698ca36a2c571268d4072fbe8415356354be0b971d462446e1acd4f19b6ddf67d6681f8cca09478693ba91c0633f40456953f4eacf07ac9f6a7605aab3b0365442d77b81ceff4e8507434a4ce"; // Replace with your actual Bearer token
  const created = new Date().toDateString();
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { username, email, created } }), // Include any additional data in the body
  });
}
router.post(
  "/loginWithGoogle",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { username, email } = req.body;
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
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      try {
        await addToStrapi(email, username);
      } catch (e) {}
      // Respond with token and user details
      res.json({
        token,
        email: user.email,
        username: user.username,
        id: user._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.post("/loginWithApple", async (req: Request, res: Response) => {
  try {
    const { username, userId, identityToken } = req.body;
    const jwtToken = jwt.decode(identityToken) as { email?: string } | null; // Type assertion

    let email = "";

    if (jwtToken != null && typeof jwtToken == "object") {
      if (jwtToken.email) {
        email = jwtToken.email;
      }
    }
    let user = await User.findOne({ email });
    let token = "";
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
      token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
    } else {
      token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
    }
    // Generate JWT token
    try {
      await addToStrapi(email, username);
    } catch (e) {}
    // Respond with token and user details
    res.json({
      token,
      email: user.email,
      username: user.username,
      id: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get(
  "/verify/:userId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.params.userId;
      const updateUser = await User.updateOne(
        { _id: userId },
        { verified: true }
      );
      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/resetPassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Generate and update the OTP for the user
    const { newOTP } = await generateAndUpdateOTP(email);

    // Compose the email data
    const emailData = {
      from: "maps.native3@gmail.com",
      to: email, // Use the email from the database
      subject: "Password Reset OTP",
      html: `<!DOCTYPE html>
      <html>
      
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Password Reset OTP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
      
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
      
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
      
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
      
          img {
            -ms-interpolation-mode: bicubic;
          }
      
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
      
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
      
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
      
          table {
            border-collapse: collapse !important;
          }
      
          a {
            color: #1a82e2;
          }
      
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
        </style>
      
      </head>
      
      <body style="background-color: #e9ecef;">
      
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          Password Reset OTP for Native Maps
        </div>
      
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <tr>
            <td align="center" bgcolor="#e9ecef">
      
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://www.mapsnative.com" target="_blank" style="display: inline-block;">
                      <img src="https://raw.githubusercontent.com/NativeMap/svgImages/main/assets/images/roundedProfile.png" alt="Logo" border="0" width="80" style="display: block; width: 80px; max-width: 80px; min-width: 80px;">
                    </a>
                  </td>
                </tr>
              </table>
      
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Password Reset OTP</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Your OTP for password reset is: <strong>${newOTP}</strong></p>
                  </td>
                </tr>
      
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">If you did not request this password reset or need further assistance, please ignore this email.</p>
                  </td>
                </tr>
              </table>
      
            </td>
          </tr>
      
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
      
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
      
              </table>
            </td>
          </tr>
      
        </table>
      
      </body>
      
      </html>
      `,
    };

    // Send the email
    send(emailData);

    res.status(200).json({ message: "OTP sent successfully", newOTP });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/changePassword", async (req, res) => {
  try {
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Update the password in the User schema and capture the document before the update
    const userBeforeUpdate = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    // Access the user ID from the document before the update
    const userId = userBeforeUpdate ? userBeforeUpdate._id : null;

    // Remove the corresponding ResetPassword collection
    await ResetPassword.deleteOne({ userId });

    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
async function generateAndUpdateOTP(email: string) {
  try {
    // Find the user by email in the User schema
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
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
      await ResetPassword.findOneAndUpdate(
        { userId: user._id },
        { lastOTP: newOTP }
      );
    }

    return { newOTP: resetPasswordUser.lastOTP, user };
  } catch (error) {
    console.error(error);
    throw new Error("Error generating and updating OTP");
  }
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
export default router;
