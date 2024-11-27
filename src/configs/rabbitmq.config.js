const amqp = require("amqplib");

let connection;
let channel;

const connectToRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URI, {
            heartbeat: 10,
        });
        channel = await connection.createChannel();

        console.log("Connected to RabbitMQ");

        connection.on("error", async (error) => {
            console.error("RabbitMQ connection error:", error);
            await reconnectToRabbitMQ();
        });

        connection.on("close", async () => {
            console.warn("RabbitMQ connection closed. Reconnecting...");
            await reconnectToRabbitMQ();
        });
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        setTimeout(connectToRabbitMQ, 5000);
    }
};

const reconnectToRabbitMQ = async () => {
    try {
        if (connection) {
            await connection.close(); // Đóng kết nối cũ
        }
    } catch (err) {
        console.error("Error closing old connection:", err);
    } finally {
        connection = null;
        channel = null;
        console.log("Reconnecting to RabbitMQ...");
        await connectToRabbitMQ(); // Kết nối lại
    }
};

const getRabbitMQChannel = async () => {
    if (!channel) {
        await connectToRabbitMQ();
    }
    return channel;
};

module.exports = {
    connectToRabbitMQ,
    getRabbitMQChannel,
};
