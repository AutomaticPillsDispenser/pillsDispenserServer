import dotenv from "dotenv";
import express, { Request, Response } from "express";
import sdkModule from "api";
import { authenticateToken } from "../middleware/feedback";
import path from "path";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const router = express.Router();

dotenv.config();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message, coords } = req.body;
    let extraMessage = "";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=pk.eyJ1IjoibmF0aXZlbWFwczMiLCJhIjoiY2xvNjRrd2ZyMGY4ZzJubzZrOXh1cGQ5MyJ9.fuZAyptTwY8Yy5cE5J8Ldw`;
    try {
      let response = await fetch(url);
      let json = await response.json();
      extraMessage += json.features[0].place_name;
    } catch (e) {}
    // Your AI API request
    const aiApiResponse = await getAIResponse(message, extraMessage);

    const result = aiApiResponse.choices[0].message.content;
    res.status(200).json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const getAIResponse = async (message: any, extraMessage: string) => {
  try {
    const sdk = sdkModule("@pplx/v0#cgfwhhzlrzivxql");
    const token = process.env.BEARER_TOKEN; // Get the bearer token from process environment

    // Set the authentication token
    sdk.auth(token);

    // AI API request
    const response = await sdk.post_chat_completions({
      model: "pplx-7b-online",
      messages: [
        {
          role: "system",
          content: `You are an assistant and a friend. Provide concise and polite answers. If asked about weather or temparture give the closest answer. Only mention the address if the user's location is directly relevant to the conversation, otherwise, avoid repeating it unnecessarily. `,
        },
        { 
          role: "user", 
          content: message + `(My location is ${extraMessage}. Please only mention it if it's necessary for the conversation.)` 
        },
      ],
      max_tokens: 150,
    });
    
    return response.data;
  } catch (error) {
    console.error("AI API Request Error:", error);
    throw error;
  }
};

export default router;
