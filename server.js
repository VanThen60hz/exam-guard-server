const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = require("./src/app");
const { handleSocketEvents } = require("./src/events/socketEvents");
const { connectToRabbitMQ } = require("./src/configs/rabbitmq");

const { connectRedis } = require("./src/configs/redis.config");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

connectRedis();

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Connect to RabbitMQ when the application starts
connectToRabbitMQ().then(() => {
    console.log("RabbitMQ is ready.");
});

handleSocketEvents(io);

server.listen(PORT, () => {
    console.log(`ExamGuard server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("ExamGuard server is closed");
        process.exit(0);
    });
});

module.exports = server;
