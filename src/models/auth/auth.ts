import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    appleId: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    verified: { type: Boolean, required: true },
    date: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
export default User