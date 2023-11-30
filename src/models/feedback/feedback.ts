import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    review: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
});

const User = mongoose.model('Feedback', userSchema);
export default User