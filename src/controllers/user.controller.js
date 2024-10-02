"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
    getProfile = async (req, res, next) => {
        const { userId } = req;
        const userProfile = await UserService.findUserById(userId);

        new SuccessResponse({
            message: "Profile retrieved successfully",
            metadata: userProfile,
        }).send(res);
    };

    updateProfile = async (req, res, next) => {
        const { userId } = req;
        const userData = req.body;
        const updatedProfile = await UserService.updateUser(userId, userData);

        new SuccessResponse({
            message: "Profile updated successfully",
            metadata: updatedProfile,
        }).send(res);
    };

    findUserById = async (req, res, next) => {
        const { id } = req.params;
        const user = await UserService.findUserById(id);

        new SuccessResponse({
            message: "User retrieved successfully",
            metadata: user,
        }).send(res);
    };

    updateUser = async (req, res, next) => {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await UserService.updateUser(id, userData);

        new SuccessResponse({
            message: "User updated successfully",
            metadata: updatedUser,
        }).send(res);
    };

    deleteUser = async (req, res, next) => {
        const { id } = req.params;
        const response = await UserService.deleteUser(id);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listUsers = async (req, res, next) => {
        const { role, gender, status, page = 1, limit = 10 } = req.query;
        const filter = {
            ...(role && { role }),
            ...(gender && { gender }),
            ...(status && { status }),
        };
        const { total, totalPages, users } = await UserService.listUsers(filter, page, limit);
        new SuccessResponse({
            message: "List of users retrieved successfully",
            metadata: {
                total,
                totalPages,
                users,
            },
        }).send(res);
    };

    searchUsers = async (req, res, next) => {
        const { query } = req.query;
        const { page = 1, limit = 10 } = req.query; // Lấy tham số phân trang
        const { total, totalPages, users } = await UserService.searchUsers(query, page, limit);
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
