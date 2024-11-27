const { redisClient } = require("../configs/redis.config.js");

const RedisService = {
    storeOTP: async (key, value, ttl = 900) => {
        await redisClient.setEx(key, ttl, value);
    },
    getOTP: async (key) => {
        return await redisClient.get(key);
    },
    deleteOTP: async (key) => {
        await redisClient.del(key);
    },
    setWithTTL: async (key, value, ttl) => {
        const stringValue = JSON.stringify(value);
        await redisClient.setEx(key, ttl, stringValue);
    },
    getValue: async (key) => {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    },
    deleteKey: async (key) => {
        await redisClient.del(key);
    },
    exists: async (key) => {
        const result = await redisClient.exists(key);
        return result === 1;
    },
    increment: async (key) => {
        return await redisClient.incr(key);
    },
    decrement: async (key) => {
        return await redisClient.decr(key);
    },
};

module.exports = RedisService;
