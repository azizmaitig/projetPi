//server.js
const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serveur HTTP partagé pour Express + WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connexion MQTT
const MQTT_BROKER = "mqtt://192.168.4.2:1883";
const client = mqtt.connect(MQTT_BROKER);

// Variables capteurs
let flameDetected = false;
let temperature = 0;
let movementDetected1 = false;
let movementDetected2 = false;

client.on("connect", () => {
    console.log("Connecté à MQTT");

    const topics = [
        "capteur/flamme",
        "capteur/temperature",
        "capteur/mouvement1",
        "capteur/mouvement2"
    ];

    topics.forEach(topic => {
        client.subscribe(topic, (err) => {
            if (err) {
                console.log(`Erreur de souscription au topic ${topic}:`, err);
            } else {
                console.log(`Souscription réussie au topic ${topic}`);
            }
        });
    });
});

client.on("message", (topic, message) => {
    const payload = message.toString().trim();
    console.log(`Message reçu sur le topic: ${topic}, Payload: ${payload}`);

    if (topic === "capteur/flamme") {
        flameDetected = payload === "1";
    } else if (topic === "capteur/temperature") {
        temperature = parseFloat(payload);
    } else if (topic === "capteur/mouvement1") {
        movementDetected1 = payload === "1";
    } else if (topic === "capteur/mouvement2") {
        movementDetected2 = payload === "1";
    }

    const data = {
        flameDetected,
        temperature,
        movementDetected1,
        movementDetected2
    };

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
});

app.get("/api/sensors", (req, res) => {
    res.json({
        flameDetected,
        temperature,
        movementDetected1,
        movementDetected2
    });
});

client.on("error", (err) => {
    console.log("Erreur MQTT:", err);
});

server.listen(port, () => {
    console.log(`Serveur HTTP et WebSocket en cours d'exécution sur http://localhost:${port}`);
});
