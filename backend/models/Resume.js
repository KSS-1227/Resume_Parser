import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: String,
  filePath: String,
  parsedData: Object,
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
