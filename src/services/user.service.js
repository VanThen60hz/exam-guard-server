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

module.exports = {
    findByEmail,
    findByEmailOrUserName, // Export the new function
};
