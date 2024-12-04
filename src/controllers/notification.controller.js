"use strict";

const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const notificationService = require("../services/notification.service");

class NotificationController {
    listNotifications = async (req, res, next) => {
        const userId = req.userId;
        const { type, isRead } = req.query;

        const notifications = await notificationService.listNotificationsByUser({
            userId,
            type,
            isRead: isRead === "true",
        });

        new SuccessResponse({
            message: "List of notifications retrieved successfully",
            metadata: notifications,
        }).send(res);
    };
}

module.exports = new NotificationController();
