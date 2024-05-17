import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    moisture: { type: Number, required: true },
    date: { type: String, required: true },
});

const User = mongoose.model('Feedback', userSchema);
export default User