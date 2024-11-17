"use strict";

const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "apiKeys";

const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        permissions: {
            type: [String],
            required: true,
            enum: ["0000", "1111", "2222"],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(apiKeySchema);

apiKeySchema.index({ key: 1 });

module.exports = model(DOCUMENT_NAME, apiKeySchema);
