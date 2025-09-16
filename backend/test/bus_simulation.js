import { io } from "socket.io-client";

// Connect to your backend
const socket = io("http://localhost:3000");

// Bus info
const busId = "BUS101";

// Starting location (Kolkata example)
let lat = 22.5726;
let lng = 88.3639;

// Function to simulate small movements
function moveBus() {
  // Random small movement
  lat += (Math.random() - 0.5) * 0.001; // ~100m max
  lng += (Math.random() - 0.5) * 0.001;

  // Emit location to server
  socket.emit("busLocationUpdate", { busId, lat, lng });

  console.log(`Sent location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
}

// Send update every 5 seconds
setInterval(moveBus, 5000);

// Optional: handle connection events
socket.on("connect", () => {
  console.log("Connected to server with socket id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
