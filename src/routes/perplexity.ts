import dotenv from "dotenv";
import express, { Request, Response } from "express";
import sdkModule from "api";
import fs from "fs"; // Import the 'fs' module for file operations
//@ts-ignore
import ElevenLabs from "elevenlabs-node";
import { authenticateToken } from "../middleware/feedback";
import path from "path";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const router = express.Router();
const voice = new ElevenLabs({
  apiKey: "b46c004e9abb3bc29ce9e5092bf18c7e", // Your API key from Elevenlabs
  voiceId: "XrExE9yKIg1WjnnlVkGX", // A Voice ID from Elevenlabs
});

dotenv.config();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    console.log(message);

    // Your AI API request
    const aiApiResponse = await getAIResponse(message);

    const result = aiApiResponse.choices[0].message.content;

    const audioBuffer = await voice.textToSpeechStream({
      fileName: "audio.mp3",
      textInput: result,
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      stability: 0.5,
      similarityBoost: 0.5,
      modelId: "eleven_multilingual_v2",
      style: 1,
      speakerBoost: true,
    });

    const filePath = path.join(__dirname, "../../audio.mp3");

    // Set appropriate headers for file download
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/tts", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    console.log(message);

    const audioBuffer = await voice
      .textToSpeech({
        fileName: "audio.mp3",
        textInput: message,
        voiceId: "21m00Tcm4TlvDq8ikWAM",
        stability: 0.5,
        similarityBoost: 0.5,
        modelId: "eleven_multilingual_v2",
        style: 1,
        responseType: "stream",
      })
      .then((res) => {
       console.log(res);
      });

    const filePath = path.join(__dirname, "../../audio.mp3");

    // Set appropriate headers for file download
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const getAIResponse = async (message: any) => {
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
          content:
            "you should make the answers very very short and accurate and within 20 words in a must",
        },
        { role: "user", content: message },
      ],
      max_tokens: 80,
    });

    return response.data;
  } catch (error) {
    console.error("AI API Request Error:", error);
    throw error;
  }
};

export default router;
