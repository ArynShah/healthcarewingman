import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Patient } from "./models/Patient.js";
import { Machine } from "./models/Machine.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/patients", async (_req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 }).lean();
  res.json(patients);
});

app.get("/api/patients/code/:code", async (req, res) => {
  const patient = await Patient.findOne({ code: req.params.code.toUpperCase() }).lean();
  if (!patient) {
    return res.status(404).json({ message: "Patient code not found" });
  }
  res.json(patient);
});

app.post("/api/patients", async (req, res) => {
  const payload = {
    ...req.body,
    code: String(req.body.code || "").toUpperCase(),
  };
  const created = await Patient.create(payload);
  res.status(201).json(created);
});

app.get("/api/machines", async (_req, res) => {
  const machines = await Machine.find().sort({ id: 1 }).lean();
  res.json(machines);
});

app.put("/api/machines/:id", async (req, res) => {
  const updated = await Machine.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: req.body.status } },
    { new: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ message: "Machine not found" });
  }
  res.json(updated);
});

app.put("/api/patients/:id", async (req, res) => {
  const updated = await Patient.findByIdAndUpdate(
    req.params.id,
    { $set: { currentStepIndex: req.body.currentStepIndex } },
    { new: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.json(updated);
});

async function seedMachines() {
  const count = await Machine.countDocuments();
  if (count > 0) return;

  await Machine.insertMany([
    { id: "mri_1", name: "MRI Scanner Room A", status: "In Use" },
    { id: "ct_1", name: "CT Scanner", status: "Available" },
    { id: "xray_1", name: "X-Ray Lab 1", status: "Maintenance" },
    { id: "blood_1", name: "Blood Analysis Lab", status: "Available" },
  ]);
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file.");
  }

  await mongoose.connect(uri);
  await seedMachines();

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
