// src/server/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = require("./src/app");
const { handleSocketEvents } = require("./src/events/socketEvents");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
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
