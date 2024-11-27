const { createClient } = require("redis");

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

redisClient.on("connect", () => {
    console.log("Redis client connected");
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection failed:", error);
    }
};

module.exports = { redisClient, connectRedis };
