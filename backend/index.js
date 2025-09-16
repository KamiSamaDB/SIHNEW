// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB Atlas (sih2025 DB)"));

// --- Bus Schema + Model ---
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

// --- Express Routes ---
// Hello
app.get("/", (req, res) => res.send("Hello World!"));

// POST /bus - create or update bus
app.post("/bus", async (req, res) => {
    try {
        const { busId, route, lat, lng } = req.body;
        let bus = await Bus.findOne({ busId });
        if (bus) {
            bus.route = route || bus.route;
            bus.location.coordinates = [lng, lat];
            bus.lastUpdated = new Date();
        } else {
            bus = new Bus({ busId, route, location: { type: "Point", coordinates: [lng, lat] } });
        }
        await bus.save();

        // Emit update via Socket.io
        io.emit(`bus-${busId}`, { lat, lng });

        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all buses
app.get("/buses", async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one bus by busId
app.get("/bus/:busId", async (req, res) => {
    try {
        const bus = await Bus.findOne({ busId: req.params.busId });
        if (!bus) return res.status(404).json({ error: "Bus not found" });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /search-busses - find nearby buses
app.post("/search-busses", async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (lat == null || lng == null) return res.status(400).json({ message: "Latitude and longitude are required" });

        const buses = await Bus.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 2000, // 2 km
                },
            },
        }).limit(10);

        if (buses.length === 0) return res.json({ count: 0, message: "No buses found within 2km range", buses: [] });

        return res.json({ count: buses.length, message: "Successfully got nearby buses", buses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --- Socket.io Integration ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Bus sends live location
    socket.on("busLocationUpdate", async ({ busId, lat, lng }) => {
        try {
            // Update MongoDB
            await Bus.findOneAndUpdate(
                { busId },
                { "location.coordinates": [lng, lat], lastUpdated: new Date() },
                { upsert: true }
            );

            // Broadcast to all clients
            io.emit(`bus-${busId}`, { lat, lng });
        } catch (err) {
            console.error("Error updating bus location:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// --- Start server ---
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
