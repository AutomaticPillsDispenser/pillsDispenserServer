import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default function connectDatabase() {
  mongoose
    .connect(
      `mongodb://sidghimire:RQSNuWDkSpIsd6vQ@ac-8itimwi-shard-00-00.7g57tkj.mongodb.net:27017,ac-8itimwi-shard-00-01.7g57tkj.mongodb.net:27017,ac-8itimwi-shard-00-02.7g57tkj.mongodb.net:27017/?ssl=true&replicaSet=atlas-1ew1kh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
    });
}
