"use strict";

const { Schema, model } = require("mongoose");
const { addTimestampsMiddleware } = require("../utils/dateHelper");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "keys";

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        privateKey: {
            type: String,
            required: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshTokenUsed: {
            type: Array,
            default: [],
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(keyTokenSchema);

keyTokenSchema.index({ user: 1, privateKey: 1, publicKey: 1 });

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
