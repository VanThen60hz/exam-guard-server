"use strict";

const { createNotification, getNotificationsByFilter } = require("../repo/notification.repo");
const { getInfoData, convertToObjectIdMongodb } = require("../utils");
const NotificationTypes = require("../constants/notificationType");
const notificationRepo = require("../repo/notification.repo");

class NotificationService {
    static async pushNotification({ type = NotificationTypes.CHEATING_NEW, receivedId, senderId, options = {} }) {
        let noti_content;

        switch (type) {
            case NotificationTypes.CHEATING_NEW:
                noti_content = `Student ${options.studentName} committed an infraction: ${options.infractionType} in the exam ${options.examTitle}`;
                break;
            case NotificationTypes.EXAM_NEW:
                noti_content = `A new exam "${options.examTitle}" has been created by teacher ${options.teacherName}`;
                break;
            default:
                noti_content = "Default notification.";
        }

        const newNotification = await notificationRepo.createNotification({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options,
        });

        return getInfoData({
            fields: [
                "_id",
                "noti_type",
                "noti_content",
                "noti_senderId",
                "noti_receivedId",
                "noti_options",
                "createdAt",
            ],
            object: newNotification,
        });
    }

    static async listNotificationsByUser({ userId, type = "ALL", isRead = false }) {
        const filter = { noti_receivedId: convertToObjectIdMongodb(userId) };

        if (type !== "ALL") {
            filter["noti_type"] = type;
        }

        const notifications = await notificationRepo.getNotificationsByFilter(filter);

        return notifications.map((notification) =>
            getInfoData({
                fields: [
                    "_id",
                    "noti_type",
                    "noti_content",
                    "noti_senderId",
                    "noti_receivedId",
                    "noti_options",
                    "sender_info",
                    "createdAt",
                ],
                object: notification,
            }),
        );
    }
}

module.exports = NotificationService;
