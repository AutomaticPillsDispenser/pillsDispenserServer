import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    waterLevel: { type: Number, required: true },
    date: { type: String, required: true },
});

const Feedback = mongoose.model('WaterLevel', userSchema);
export default Feedback