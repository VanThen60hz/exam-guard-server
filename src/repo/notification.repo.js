"use strict";

const notiModel = require("../models/notification.model");

class NotificationRepo {
    constructor() {
        this.selectFields = {
            noti_type: 1,
            noti_senderId: 1,
            noti_receivedId: 1,
            noti_content: 1,
            createdAt: 1,
        };
    }

    static async createNotification(data) {
        return await notiModel.create(data);
    }

    static async getNotificationsByFilter(filter = {}, options = {}) {
        const query = notiModel.find(filter).select(this.prototype.selectFields);

        if (options.populateSender) {
            query.populate("noti_senderId", "name email");
        }

        if (options.populateReceiver) {
            query.populate("noti_receivedId", "name email");
        }

        if (options.limit) {
            query.limit(options.limit);
        }

        if (options.skip) {
            query.skip(options.skip);
        }

        return await query.lean();
    }
}

module.exports = NotificationRepo;
