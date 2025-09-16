# MitrYaan 🚌



**Real-time public transport tracking for India's emerging cities, powered by the community.**

---

## 🎯 The Problem

In small cities and Tier-2 towns across India, public transport is often unreliable. Commuters face unpredictable bus schedules, leading to long, uncertain waiting times. This makes public transport an unattractive option, increasing reliance on private vehicles and worsening traffic and pollution. Traditional hardware-based GPS tracking systems are often too expensive for these municipalities to implement.

## ✨ Our Solution

**MitrYaan** is a **zero-hardware, asset-light solution** that bridges this gap. Instead of installing costly GPS units, MitrYaan leverages the technology already in everyone's pocket: the smartphone.

Our platform uses a simple Progressive Web App (PWA) on the bus conductor's phone to transmit its location in real-time. Commuters can then use the same app on their phones to see exactly where their bus is and get an accurate Estimated Time of Arrival (ETA).

**[➡️ View the Live Demo](https://mitryaan-demo.vercel.app/)** *(Replace with your actual demo link)*

---

## 🚀 Key Features

* **📍 Real-Time Tracking:** A live map view showing the precise location of the bus.
* **🔍 Destination-First Search:** Commuters enter their destination, and the app shows all relevant bus routes.
* **📱 Unified Web App (PWA):** A single, install-free app that works for both Drivers and Commuters.
* **📶 Low-Bandwidth "Lite Mode":** A text-only interface that provides ETAs and status updates, ensuring functionality even on 2G networks.
* **🔘 Simple Driver Interface:** A clean, one-button "Start/Stop Trip" interface for conductors to use with minimal distraction.
* **📊 Data for Authorities:** Provides valuable, anonymized data to municipalities for route optimization and planning.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/), [Material-UI (MUI)](https://mui.com/), [Leaflet](https://leafletjs.com/)                                     |
| **Backend** | [FastAPI (Python)](https://fastapi.tiangolo.com/) or [Node.js (Express)](https://expressjs.com/)                                                                         |
| **Database** | [Firebase Realtime Database](https://firebase.google.com/docs/database)                                                                                                |
| **Deployment**| [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend)                                                                                        |

---

## 📸 Screenshots

| Role Selection                                 | Commuter: Destination Search                  | Commuter: Route Results                     | Commuter: Live Tracking                    |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
|       |  |     |  |

---

## 🏛️ System Architecture

The user flow for a commuter is designed to be simple and intuitive.

```mermaid
graph LR;
    A(Start) --> B[User opens MitrYaan PWA];
    B --> C[User selects 'Commuter' Role];
    C --> D["User enters destination (e.g., 'Fort')"];
    D --> E{Is Destination Valid?};
    E -- Yes --> F[Backend fetches all routes serving the destination];
    E -- No --> D;
    F --> G["App displays available routes (e.g., Route 10A, 2B)"];
    G --> H["User selects a route (e.g., 10A)"];
    H --> I[App displays real-time bus location on map];
    I --> J(End);