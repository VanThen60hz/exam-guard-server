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
    phone_number: 1,
    address: 1,
    status: 1,
};

const findUserByUserId = async (userId, select = selectFields) => {
    return await userModel
        .findOne({
            _id: userId,
        })
        .select(select)
        .lean();
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

const listUsers = async (filter = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await userModel.find(filter).skip(skip).limit(limit).lean();
};

const searchUsers = async (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const isNumber = !isNaN(query);
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(query);

    return await userModel
        .find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { phone_number: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } },
                ...(isNumber ? [{ ssn: Number(query) }] : []),
                { gender: { $regex: query, $options: "i" } },
                { status: { $regex: query, $options: "i" } },
                ...(isDate ? [{ dob: query }, { createdAt: query }, { updatedAt: query }] : []),
            ],
        })
        .skip(skip)
        .limit(limit)
        .lean();
};

module.exports = {
    findUserByUserId,
    findByEmail,
    findByEmailOrUserName,
    updateUser,
    deleteUser,
    listUsers,
    searchUsers,
};
