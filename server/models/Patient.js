import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    healthCard: { type: String, default: "" },
    symptoms: { type: [String], default: [] },
    nextSteps: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
