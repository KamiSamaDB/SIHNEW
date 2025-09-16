import { io } from "socket.io-client";

// Connect to backend Socket.io server
const socket = io("http://localhost:3000");

// The bus we want to track
const busId = "BUS101";

// Listen for updates from this bus
socket.on(`bus-${busId}`, ({ lat, lng }) => {
    console.log(`Bus ${busId} current location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
});

// Optional: connection events
socket.on("connect", () => {
    console.log("Connected to server with socket id:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
