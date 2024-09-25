"use strict";
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");
const roles = require("../constants/roles");
const { findByEmailOrUserName } = require("./user.service");

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const foundUser = await findByEmailOrUserName(email);
        if (!foundUser) {
            throw new BadRequestError("User not registered");
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new UnauthorizedError("Password is incorrect");
        }
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair({ userId: foundUser._id, email }, publicKey, privateKey);
        await keyTokenService.createKeyToken({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        });
        return {
            user: getInfoData({
                fields: ["_id", "username", "name", "email", "role", "avatar", "gender", "ssn", "address", "phone_number", "createdAt", "updatedAt"],
                object: foundUser,
            }),
            tokens,
        };
    };

    static signUp = async ({ username, password, name, email, avatar, role, gender, ssn, address, phone_number }) => {
        // Step 1: Check if email exists
        const existingUser = await userModel.findOne({ email }).lean();
        if (existingUser) {
            throw new BadRequestError("User already registered");
        }

        // Step 2: Validate role
        if (!Object.values(roles).includes(role)) {
            return {
                code: "INVALID_ROLE",
                message: "Invalid role",
            };
        }

        // Step 3: Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Step 4: Create new user
        const newUser = await userModel.create({
            username,
            name,
            email,
            password: passwordHash,
            role,
            avatar,
            gender,
            ssn,
            address,
            phone_number,
        });

        if (newUser) {
            // Generate private and public keys
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            console.log({ privateKey, publicKey });

            // Step 5: Save keys to the key store
            const keyStore = await keyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                return {
                    code: "ERROR_KEYSTORE",
                    message: "Error when creating key store",
                };
            }

            // Step 6: Create token pair
            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey);
            console.log("Created Token Success: ", tokens);

            return {
                user: getInfoData({
                    fields: ["_id", "username", "name", "email", "role", "avatar", "gender", "ssn", "address", "phone_number", "createdAt", "updatedAt"],
                    object: newUser,
                }),
                tokens,
            };
        }
    };

    static editUser = async (userId, userData) => {
        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            throw new BadRequestError("User not found");
        }
        return updatedUser;
    };

    static deleteUser = async (userId) => {
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new BadRequestError("User not found");
        }
        return { message: "User deleted successfully" };
    };

    static listUsers = async () => {
        const users = await userModel.find().lean(); // Lấy tất cả người dùng
        return users;
    };
}

module.exports = AccessService;
