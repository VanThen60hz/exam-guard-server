const { redisClient } = require("../configs/redis.config.js");

const storeOTP = async (key, value) => {
    await redisClient.setEx(key, 900, value);
};

const getOTP = async (key) => {
    return await redisClient.get(key);
};

const deleteOTP = async (key) => {
    await redisClient.del(key);
};

module.exports = { storeOTP, getOTP, deleteOTP };
