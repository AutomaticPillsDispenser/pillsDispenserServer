import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    lastOTP: { type: Number, required: true },
    userId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
});

const ResetPassword = mongoose.model('ResetPassword', userSchema);
export default ResetPassword
