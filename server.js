// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const amqp = require("amqplib");
const app = require("./src/app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

async function setupRabbitMQConsumer() {
    try {
        const connection = await amqp.connect(
            "amqps://qpjwovtb:gRLAwlqVnUhwKwD12Y6QLDQSplgDrf-i@octopus.rmq3.cloudamqp.com/qpjwovtb",
        );
        const channel = await connection.createChannel();
        const queue = "cheating_notifications";

        await channel.assertQueue(queue, { durable: false });

        channel.consume(queue, (message) => {
            if (message !== null) {
                const notificationData = JSON.parse(message.content.toString());
                console.log("Received cheating notification from RabbitMQ:", notificationData);

                io.emit("newCheatingDetected", notificationData);

                channel.ack(message);
            }
        });

        console.log("RabbitMQ consumer is set up and listening for messages.");
    } catch (error) {
        console.error("Failed to set up RabbitMQ consumer:", error);
    }
}

server.listen(PORT, () => {
    console.log(`ExamGuard server is running on port ${PORT}`);
    setupRabbitMQConsumer();
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("ExamGuard server is closed");
        process.exit(0);
    });
});
