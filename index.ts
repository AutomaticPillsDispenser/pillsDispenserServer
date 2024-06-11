import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDatabase from "./src/config/databaseConnection.js";
import Feedback from "./src/models/feedback/feedback.js";
const app = express();
const port = 3000;

connectDatabase();
app.use(express.json({ limit: "10mb" })); // Set the limit to 10 megabytes (adjust as needed)
app.listen(port, () => {
  console.log(`[Server]: Running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Server Working correctly" });
});

app.get("/getData", async (req, res) => {
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

app.post("/sendData", async (req, res) => {
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
