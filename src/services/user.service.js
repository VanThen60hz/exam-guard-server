"use strict";

const mongoose = require("mongoose");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const userRepo = require("../repo/user.repo");
const cheatingHistoryRepo = require("../repo/cheatingHistory.repo");
const cheatingStatisticRepo = require("../repo/cheatingStatistic.repo");
const gradeRepo = require("../repo/grade.repo");
const cloudinary = require("../configs/cloudinary.config");

class UserService {
    static findUserById = async (userId) => {
        const user = await userRepo.findUserByUserId(userId);
        if (!user) {
            throw new BadRequestError("User not found");
        }
        return getInfoData({
            fields: [
                "_id",
                "username",
                "name",
                "email",
                "role",
                "avatar",
                "gender",
                "ssn",
                "dob",
                "address",
                "phone_number",
                "status",
                "createdAt",
                "updatedAt",
            ],
            object: user,
        });
    };

    static updateUser = async (userId, userData) => {
        const existingUser = await userRepo.findUserByUserId(userId);
        if (!existingUser) {
            throw new BadRequestError("User not found");
        }

        if (userData.avatar && existingUser.avatar) {
            const publicId = existingUser.avatar.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        const updatedUser = await userRepo.updateUser(userId, userData);
        if (!updatedUser) {
            throw new BadRequestError("Failed to update user");
        }

        return getInfoData({
            fields: [
                "_id",
                "username",
                "name",
                "email",
                "role",
                "avatar",
                "gender",
                "ssn",
                "dob",
                "address",
                "phone_number",
                "status",
                "createdAt",
                "updatedAt",
            ],
            object: updatedUser,
        });
    };

    static deleteUser = async (userId) => {
        try {
            const deletedUser = await userRepo.deleteUser(userId);
            if (!deletedUser) {
                throw new BadRequestError("User not found");
            }

            const promises = [
                cheatingStatisticRepo.deleteByStudent(userId),
                cheatingHistoryRepo.deleteByStudent(userId),
                gradeRepo.deleteByStudent(userId),
            ];

            await Promise.all(promises);

            return { message: "User and related records deleted successfully" };
        } catch (error) {
            throw error;
        }
    };

    static listUsers = async (filter = {}, page, limit) => {
        const totalUsers = await userRepo.countUsers(filter);
        const users = await userRepo.listUsers(filter, page, limit);
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            total: totalUsers,
            totalPages,
            users: users.map((user) =>
                getInfoData({
                    fields: [
                        "_id",
                        "username",
                        "name",
                        "email",
                        "role",
                        "avatar",
                        "gender",
                        "ssn",
                        "dob",
                        "address",
                        "phone_number",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: user,
                }),
            ),
        };
    };

    static searchUsers = async (query, page, limit) => {
        const { totalUsers, users } = await userRepo.searchUsers(query, page, limit); // Gọi searchUsers từ repo
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            total: totalUsers,
            totalPages,
            users: users.map((user) =>
                getInfoData({
                    fields: [
                        "_id",
                        "username",
                        "name",
                        "email",
                        "role",
                        "avatar",
                        "gender",
                        "ssn",
                        "dob",
                        "address",
                        "phone_number",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: user,
                }),
            ),
        };
    };

    static findUserByEmailOrPhone = async (email, phone_number) => {
        const user = await userRepo.findByEmailOrPhone(email, phone_number);
        if (!user) {
            throw new BadRequestError("User not found");
        }
        return user;
    };
}

module.exports = UserService;
