import express, { Request, Response } from "express";
import Feedback from "../models/feedback/feedback";
const router = express.Router();

router.use(express.json());

router.post("/sendData", async (req: Request, res: Response) => {
  try {
    const { waterLevel } = req.body;

    // Create a new feedback instance
    const feedback = new Feedback({
      waterLevel,
      date: new Date().toISOString(), // You might want to use a library like moment.js for better date formatting
    });

    await feedback.save();

    res.status(201).json({ message: "Data submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getData", async (req: Request, res: Response) => {
    try {
      const latestFeedback = await Feedback.findOne().sort({ date: -1 });
  
      if (!latestFeedback) {
        return res.status(404).json({ message: "No data found" });
      }
  
      res.status(200).json(latestFeedback);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
export default router;

