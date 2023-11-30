import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    location: { type: [Number, Number], required: true },
    reportType: { type: String, required: true },
    reportSubType: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
});

const ReportRecord = mongoose.model('ReportRecord', userSchema);
export default ReportRecord