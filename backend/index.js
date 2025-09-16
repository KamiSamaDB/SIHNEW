// index.js
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(morgan("dev"));



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas (sih2025 DB)"));

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


app.get("/", (req, res) => res.send("Hello World!"));

app.post("/bus", async (req, res) => {
    try {
        const { busId, route, lat, lng } = req.body;

        let bus = await Bus.findOne({ busId });
        if (bus) {
            // update existing bus
            bus.route = route || bus.route;
            bus.location.coordinates = [lng, lat];
            bus.lastUpdated = new Date();
        } else {
            // create new bus
            bus = new Bus({
                busId,
                route,
                location: { type: "Point", coordinates: [lng, lat] },
            });
        }

        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/buses", async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/bus/:busId", async (req, res) => {
    try {
        const bus = await Bus.findOne({ busId: req.params.busId });
        if (!bus) return res.status(404).json({ error: "Bus not found" });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/search-busses", async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (lat == null || lng == null) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const buses = await Bus.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 2000, // 2 km
                },
            },
        }).limit(10);

        if (buses.length === 0) {
            return res.json({
                count: 0,
                message: "No buses found within 2km range",
                buses: [],
            });
        }

        return res.json({
            count: buses.length,
            message: "Successfully got nearby buses",
            buses,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
