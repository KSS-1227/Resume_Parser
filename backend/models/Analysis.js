import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  jobData: Object,
  results: Object,
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
