import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "In Use", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export const Machine = mongoose.model("Machine", machineSchema);
