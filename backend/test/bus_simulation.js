import { io } from "socket.io-client";


const socket = io("http://localhost:3000");


const busId = "BUS2002";

let lat = 12.984;
let lng = 79.169;


function moveBus() {
  // Random small movement
  lat += (Math.random() - 0.5) * 0.003; 
  lng += (Math.random() - 0.5) * 0.003;

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
