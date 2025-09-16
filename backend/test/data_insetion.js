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
        location: { type: "Point", coordinates: [79.1670, 12.9820] },
    },
    {
        busId: "BUS1002",
        route: "Route B",
        location: { type: "Point", coordinates: [79.1680, 12.9830] },
    },
    {
        busId: "BUS1003",
        route: "Route C",
        location: { type: "Point", coordinates: [79.1665, 12.9815] },
    },
    {
        busId: "BUS1004",
        route: "Route D",
        location: { type: "Point", coordinates: [79.1690, 12.9840] },
    },
    {
        busId: "BUS1005",
        route: "Route E",
        location: { type: "Point", coordinates: [79.1655, 12.9835] },
    },

    // Out of 2 km (~5 km away)
    {
        busId: "BUS2001",
        route: "Route F",
        location: { type: "Point", coordinates: [79.2000, 12.9900] },
    },
    {
        busId: "BUS2002",
        route: "Route G",
        location: { type: "Point", coordinates: [79.2100, 12.9750] },
    },
    {
        busId: "BUS2003",
        route: "Route H",
        location: { type: "Point", coordinates: [79.1950, 12.9700] },
    },
    {
        busId: "BUS2004",
        route: "Route I",
        location: { type: "Point", coordinates: [79.2050, 12.9850] },
    },
    {
        busId: "BUS2005",
        route: "Route J",
        location: { type: "Point", coordinates: [79.2150, 12.9650] },
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
