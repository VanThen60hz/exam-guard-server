"use strict";

const { SuccessResponse } = require("../core/success.response");
const userService = require("../services/user.service");
const cloudinary = require("../configs/cloudinary.config");

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
        try {
            const { userId } = req;

            if (req.files && req.files.avatar && req.files.avatar.length > 0) {
                req.body.avatar = req.files.avatar[0].path;
            }

            const updatedProfile = await userService.updateUser(userId, req.body);

            new SuccessResponse({
                message: "Profile updated successfully",
                metadata: updatedProfile,
            }).send(res);
        } catch (error) {
            if (req.files && req.files.avatar) {
                await cloudinary.uploader.destroy(req.files.avatar[0].filename);
            }
            next(error);
        }
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
        try {
            const { id } = req.params;

            if (req.files && req.files.avatar && req.files.avatar.length > 0) {
                req.body.avatar = req.files.avatar[0].path;
            }

            const updatedUser = await userService.updateUser(id, req.body);

            new SuccessResponse({
                message: "User updated successfully",
                metadata: updatedUser,
            }).send(res);
        } catch (error) {
            if (req.files && req.files.avatar) {
                await cloudinary.uploader.destroy(req.files.avatar[0].filename);
            }
            next(error);
        }
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
