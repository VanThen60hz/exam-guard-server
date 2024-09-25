"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class UserController {
    updateUser = async (req, res, next) => {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await AccessService.updateUser(id, userData);

        new SuccessResponse({
            message: "User updated successfully",
            metadata: updatedUser,
        }).send(res);
    };

    deleteUser = async (req, res, next) => {
        const { id } = req.params;
        const response = await AccessService.deleteUser(id);

        new SuccessResponse({
            message: response.message,
        }).send(res);
    };

    listUsers = async (req, res, next) => {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await AccessService.listUsers(filter);
        new SuccessResponse({
            message: "List of users retrieved successfully",
            metadata: users,
        }).send(res);
    };

    searchUsers = async (req, res, next) => {
        const { query } = req.query;
        const users = await AccessService.searchUsers(query);
        new SuccessResponse({
            message: "Search results retrieved successfully",
            metadata: users,
        }).send(res);
    };
}

module.exports = new UserController();
