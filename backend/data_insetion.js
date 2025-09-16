// seedBuses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// --- 1. Schema ---
const busSchema = new mongoose.Schema({
    busId: { type: String, required: true, unique: true },
    route: String,
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    lastUpdated: { type: Date, default: Date.now },
});

busSchema.index({ location: "2dsphere" });
const Bus = mongoose.model("Bus", busSchema, "busses");

// --- 2. Sample Data ---
const sampleBuses = [
    // Within 2 km
    {
        busId: "BUS1001",
        route: "Route A",
        location: { type: "Point", coordinates: [88.3635, 22.5730] },
    },
    {
        busId: "BUS1002",
        route: "Route B",
        location: { type: "Point", coordinates: [88.3650, 22.5720] },
    },
    {
        busId: "BUS1003",
        route: "Route C",
        location: { type: "Point", coordinates: [88.3605, 22.5745] },
    },
    {
        busId: "BUS1004",
        route: "Route D",
        location: { type: "Point", coordinates: [88.3680, 22.5715] },
    },
    {
        busId: "BUS1005",
        route: "Route E",
        location: { type: "Point", coordinates: [88.3700, 22.5750] },
    },

    // Out of 2 km range (~5 km away)
    {
        busId: "BUS2001",
        route: "Route F",
        location: { type: "Point", coordinates: [88.4000, 22.5800] },
    },
    {
        busId: "BUS2002",
        route: "Route G",
        location: { type: "Point", coordinates: [88.4100, 22.5650] },
    },
    {
        busId: "BUS2003",
        route: "Route H",
        location: { type: "Point", coordinates: [88.3950, 22.5900] },
    },

    // Edge case (~2 km away)
    {
        busId: "BUS3001",
        route: "Route I",
        location: { type: "Point", coordinates: [88.3850, 22.5700] },
    },
    {
        busId: "BUS3002",
        route: "Route J",
        location: { type: "Point", coordinates: [88.3600, 22.5600] },
    },
];


// --- 3. Connect + Insert ---
const run = async () => {
    try {
        await mongoose.connect("", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        await Bus.deleteMany(); // clear old data (optional)
        await Bus.insertMany(sampleBuses);

        console.log("🚍 Sample buses inserted successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding buses:", err);
        process.exit(1);
    }
};

run();
