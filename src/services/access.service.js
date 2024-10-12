"use strict";
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, UnauthorizedError } = require("../core/error.response");
const roles = require("../constants/roles");
const userRepo = require("../repo/user.repo");

class AccessService {
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError("Refresh token is invalid! Login again");
        }
        if (keyStore.refreshToken !== refreshToken) {
            throw new UnauthorizedError("Refresh token is invalid");
        }
        const foundUser = await userRepo.findByEmail(email);
        if (!foundUser) {
            throw new UnauthorizedError("Shop not found");
        }
        // create new token pair
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
        // update refreshTokenUsed
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });
        return {
            user,
            tokens,
        };
    };

    static signUp = async ({
        username,
        password,
        name,
        email,
        avatar,
        role,
        gender,
        ssn,
        address,
        phone_number,
        dob,
        status,
    }) => {
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
            dob,
            status,
        });

        if (newUser) {
            // Generate private and public keys
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

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
            const { _id: userId } = newUser;
            const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

            return {
                user: getInfoData({
                    fields: [
                        "_id",
                        "username",
                        "name",
                        "email",
                        "role",
                        "avatar",
                        "gender",
                        "dob",
                        "ssn",
                        "address",
                        "phone_number",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: newUser,
                }),
                tokens,
            };
        }
    };

    static login = async ({ usernameOrEmail, password, refreshToken = null }) => {
        const foundUser = await userRepo.findByEmailOrUserName(usernameOrEmail);
        if (!foundUser) {
            throw new BadRequestError("User not registered");
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new UnauthorizedError("Password is incorrect");
        }

        if (foundUser.status === "INACTIVE") {
            throw new UnauthorizedError(
                "Your account is not activated or has been temporarily disabled, please contact ADMIN.",
            );
        } else if (foundUser.status === "SUSPENDED") {
            throw new UnauthorizedError(
                "Your account suspended due to violations or suspicious behavior cannot be used until reviewed.",
            );
        }

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const { _id: userId, email } = foundUser;
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        await keyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        });
        return {
            user: getInfoData({
                fields: [
                    "_id",
                    "username",
                    "name",
                    "email",
                    "role",
                    "avatar",
                    "gender",
                    "dob",
                    "ssn",
                    "address",
                    "phone_number",
                    "status",
                    "createdAt",
                    "updatedAt",
                ],
                object: foundUser,
            }),
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyToken(keyStore._id);
        return delKey;
    };
}

module.exports = AccessService;
