"use strict";

const { SuccessResponse } = require("../core/success.response");
const userService = require("../services/user.service");

class UserController {
    getProfile = async (req, res, next) => {
        const { userId } = req;
        const userProfile = await userService.findUserById(userId);

        new SuccessResponse({
            message: "Profile retrieved successfully",
            metadata: userProfile,
        }).send(res);
    };

    updateProfile = async (req, res, next) => {
        const { userId } = req;
        const userData = req.body;
        const updatedProfile = await userService.updateUser(userId, userData);

        new SuccessResponse({
            message: "Profile updated successfully",
            metadata: updatedProfile,
        }).send(res);
    };

    findUserById = async (req, res, next) => {
        const { id } = req.params;
        const user = await userService.findUserById(id);

        new SuccessResponse({
            message: "User retrieved successfully",
            metadata: user,
        }).send(res);
    };

    updateUser = async (req, res, next) => {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await userService.updateUser(id, userData);

        new SuccessResponse({
            message: "User updated successfully",
            metadata: updatedUser,
        }).send(res);
    };

    deleteUser = async (req, res, next) => {
        const { id } = req.params;
        const response = await userService.deleteUser(id);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listUsers = async (req, res, next) => {
        try {
            const { role, gender, status, page = 1, limit = 10 } = req.query;
            const filter = {
                ...(role && { role }),
                ...(gender && { gender }),
                ...(status && { status }),
            };
            const { total, totalPages, users } = await userService.listUsers(filter, page, limit);

            // Gửi phản hồi thành công
            new SuccessResponse({
                message: "List of users retrieved successfully",
                metadata: {
                    total,
                    totalPages,
                    users,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    searchUsers = async (req, res, next) => {
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query;
        const { total, totalPages, users } = await userService.searchUsers(query, page, limit);
        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: {
                total,
                totalPages,
                users,
            },
        }).send(res);
    };
}

module.exports = new UserController();
