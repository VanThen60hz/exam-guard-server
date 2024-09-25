"use strict";
const userModel = require("../models/user.model");

const selectFields = {
    email: 1,
    username: 1,
    password: 2,
    name: 1,
    role: 1,
    avatar: 1,
    gender: 1,
    ssn: 1,
    address: 1,
    phone_number: 1,
};

const findByEmail = async (email, select = selectFields) => {
    return await userModel
        .findOne({
            email,
        })
        .select(select)
        .lean();
};

const findByEmailOrUserName = async (identifier, select) => {
    return await userModel
        .findOne({
            $or: [{ email: identifier }, { username: identifier }],
        })
        .select(select)
        .lean();
};

const updateUser = async (userId, userData) => {
    return await userModel.findByIdAndUpdate(userId, userData, { new: true });
};

const deleteUser = async (userId) => {
    return await userModel.findByIdAndDelete(userId);
};

const listUsers = async (filter = {}) => {
    return await userModel.find(filter).lean();
};

const searchUsers = async (query) => {
    // Kiểm tra xem query có phải là số hay không
    const isNumber = !isNaN(query);

    return await userModel
        .find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { phone_number: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } },
                // Tìm kiếm ssn chỉ khi query là số
                ...(isNumber ? [{ ssn: Number(query) }] : []),
                { gender: { $regex: query, $options: "i" } },
            ],
        })
        .lean();
};

module.exports = {
    findByEmail,
    findByEmailOrUserName,
    updateUser,
    deleteUser,
    listUsers,
    searchUsers,
};
