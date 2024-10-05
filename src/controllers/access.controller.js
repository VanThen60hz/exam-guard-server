"use strict";

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const accessService = require("../services/access.service");
class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        new OK({
            message: "Refresh token OK",
            metadata: await accessService.handlerRefreshToken(
                {
                    refreshToken: req.refreshToken,
                    user: req.user,
                    keyStore: req.keyStore,
                },
                req.body.refreshToken,
            ),
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register OK",
            metadata: await accessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };

    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login OK",
            metadata: await accessService.login(req.body),
        }).send(res);
    };

    logout = async (req, res, next) => {
        new OK({
            message: "Logout OK",
            metadata: await accessService.logout(req.keyStore),
        }).send(res);
    };
}

module.exports = new AccessController();
