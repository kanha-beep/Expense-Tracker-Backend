import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  type: { type: String, required: true },
}, {timestamps:true});

export default mongoose.model("Tracker", trackerSchema);