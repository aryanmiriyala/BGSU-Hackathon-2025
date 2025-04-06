// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

app.use(express.json());

// ---------------- MongoDB Setup ----------------

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const diseaseSchema = new mongoose.Schema({
  country: String,
  diseaseName: String,
  diseaseCategory: String,
  populationAffected: Number,
  healthcareAccess: Number,
  treatmentType: String,
  availabilityOfVaccines: String,
  recoveryRate: Number,
});

const Disease = mongoose.model("Disease", diseaseSchema);

// ---------------- Directories ----------------

const userInfoDir = path.join(__dirname, "UserInfo");
const userHealthDir = path.join(__dirname, "UserHealth");

if (!fs.existsSync(userInfoDir)) fs.mkdirSync(userInfoDir);
if (!fs.existsSync(userHealthDir)) fs.mkdirSync(userHealthDir);

// ---------------- Routes ----------------

// Save or update user in UsersInfo.json
app.post("/api/user", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Missing name or email" });
  }

  const usersFile = path.join(userInfoDir, "UsersInfo.json");
  let users = {};

  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
    } catch {
      users = {};
    }
  }

  const existingUser = Object.values(users).find((u) => u.email === email);
  if (existingUser) {
    return res.json({
      message: "User already exists",
      userId: existingUser.userId,
    });
  }

  const userId = Math.floor(100000 + Math.random() * 900000).toString();
  users[userId] = { userId, name, email };

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.status(201).json({ message: "New user added", userId });
});

// Save health info per user
app.post("/api/health/:userId", (req, res) => {
  let { userId } = req.params;
  if (!userId || userId === "null") userId = "userHealthInfo";

  const filePath = path.join(userHealthDir, `${userId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ message: `Health info saved as ${userId}.json` });
});

// Get health info
app.get("/api/health/:userId", (req, res) => {
  let { userId } = req.params;
  if (!userId || userId === "null") userId = "userHealthInfo";

  const filePath = path.join(userHealthDir, `${userId}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ message: "No health info found." });
  }
});

// Get grouped diseases from MongoDB
app.get("/api/diseases/:country", async (req, res) => {
  try {
    const countryName = req.params.country;
    const diseases = await Disease.aggregate([
      { $match: { country: new RegExp(countryName, "i") } },
      {
        $group: {
          _id: "$diseaseName",
          diseaseCategory: { $first: "$diseaseCategory" },
          populationAffected: { $sum: "$populationAffected" },
          healthcareAccess: { $avg: "$healthcareAccess" },
          treatmentType: { $first: "$treatmentType" },
          availabilityOfVaccines: { $first: "$availabilityOfVaccines" },
          recoveryRate: { $avg: "$recoveryRate" },
          occurrences: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          diseaseName: "$_id",
          diseaseCategory: 1,
          populationAffected: 1,
          healthcareAccess: { $round: ["$healthcareAccess", 2] },
          treatmentType: 1,
          availabilityOfVaccines: 1,
          recoveryRate: { $round: ["$recoveryRate", 2] },
          occurrences: 1,
        },
      },
      { $sort: { populationAffected: -1 } },
    ]);

    res.json(diseases || []);
  } catch (error) {
    console.error("Error getting diseases:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Disease API" });
});

app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const PORT = 5020;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
