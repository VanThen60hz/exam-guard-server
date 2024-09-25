"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login OK",
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register OK",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };

    editUser = async (req, res, next) => {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await AccessService.editUser(id, userData);
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
        const users = await AccessService.listUsers();
        new SuccessResponse({
            message: "List of users retrieved successfully",
            metadata: users,
        }).send(res);
    };
}

module.exports = new AccessController();
