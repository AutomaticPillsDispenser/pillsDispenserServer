import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    selectedLocation: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
});

const TravelRecord = mongoose.model('TravelRecord', userSchema);
export default TravelRecord