const { redisClient } = require("../configs/redis.config.js");

/**
 * Lưu OTP với TTL (900 giây mặc định)
 * @param {string} key - Key lưu OTP.
 * @param {string|number} value - Giá trị OTP.
 */
const storeOTP = async (key, value, ttl = 900) => {
    await redisClient.setEx(key, ttl, value);
};

/**
 * Lấy OTP từ Redis.
 * @param {string} key - Key của OTP cần lấy.
 * @returns {Promise<string|null>} - Giá trị OTP hoặc null nếu không tồn tại.
 */
const getOTP = async (key) => {
    return await redisClient.get(key);
};

/**
 * Xóa OTP khỏi Redis.
 * @param {string} key - Key của OTP cần xóa.
 */
const deleteOTP = async (key) => {
    await redisClient.del(key);
};

/**
 * Lưu một giá trị vào Redis với TTL (time-to-live).
 * @param {string} key - Key lưu trữ.
 * @param {any} value - Giá trị cần lưu.
 * @param {number} ttl - Thời gian sống (giây).
 */
const setWithTTL = async (key, value, ttl) => {
    const stringValue = JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringValue);
};

/**
 * Lấy giá trị từ Redis.
 * @param {string} key - Key cần lấy giá trị.
 * @returns {Promise<any>} - Giá trị JSON được parse hoặc null nếu không tồn tại.
 */
const getValue = async (key) => {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
};

/**
 * Xóa một key khỏi Redis.
 * @param {string} key - Key cần xóa.
 */
const deleteKey = async (key) => {
    await redisClient.del(key);
};

/**
 * Kiểm tra key có tồn tại trong Redis.
 * @param {string} key - Key cần kiểm tra.
 * @returns {Promise<boolean>} - True nếu key tồn tại, false nếu không.
 */
const exists = async (key) => {
    const result = await redisClient.exists(key);
    return result === 1;
};

/**
 * Increment giá trị trong Redis.
 * @param {string} key - Key của giá trị cần tăng.
 * @returns {Promise<number>} - Giá trị sau khi tăng.
 */
const increment = async (key) => {
    return await redisClient.incr(key);
};

/**
 * Decrement giá trị trong Redis.
 * @param {string} key - Key của giá trị cần giảm.
 * @returns {Promise<number>} - Giá trị sau khi giảm.
 */
const decrement = async (key) => {
    return await redisClient.decr(key);
};

module.exports = {
    storeOTP,
    getOTP,
    deleteOTP,
    setWithTTL,
    getValue,
    deleteKey,
    exists,
    increment,
    decrement,
};
