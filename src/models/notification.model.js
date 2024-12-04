"use strict";
const { model, Schema } = require("mongoose");
const NotificationTypes = require("../constants/notificationType");
const { addTimestampsMiddleware } = require("../utils/dateHelper");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

const notificationSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: Object.values(NotificationTypes),
            required: true,
        },
        noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        noti_receivedId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(notificationSchema);

notificationSchema.index({ noti_type: 1, noti_content: 1, noti_options: 1 });

module.exports = model(DOCUMENT_NAME, notificationSchema);
