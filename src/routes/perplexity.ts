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
    console.log(message)
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
    const token = process.env.BEARER_TOKEN;
console.log("First")
    sdk.auth(token);

    // Craft the prompt combining general capabilities and communication style
    const prompt = `Answer user questions in a helpful, informative way, following these guidelines:

      **General Capabilities:**
      - Provide short, detailed answers for general inquiries (weather, sports, travel, etc.).
      - Assist with travel planning (flights, hotels, guides), healthy lifestyle, dating advice, book summaries, and more.
      - Offer up-to-date information on live sports scores and event statuses.
      - Answer other general questions concisely and accurately.
      - Conduct quizzes with ten questions on chosen topics, providing scores and offering options to continue.

      **Communication Style:**
      - Avoid mentioning AI or LLM status.
      - Use "Unsure about the answer" if uncertain.
      - No disclaimers about expertise, avoid suggesting professional consultation.
      - Provide concise information, expand only on request.
      - Prioritize accuracy and directness.
      - Spell out temperature units (e.g., Fahrenheit) in weather reports.
      - Keep responses brief, especially following lengthy questions.

      **Specifics to this request:**
      - User question: ${message}
      - User location (optional, for weather only): ${extraMessage} (Only use if necessary for the answer)
    `;

    const response = await sdk.post_chat_completions({
      model: "pplx-7b-online", // Assuming this model suits your client's needs
      messages: [
        {
          role: "system",
          content: prompt,
        },
        { 
          role: "user", 
          content: message, 
        },
      ],
      max_tokens: 150,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("AI API Request Error:", error);
    // Implement your custom error handling here (e.g., return a generic error message)
  }
};

export default router;
