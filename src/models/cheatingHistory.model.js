const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "CheatingHistory";
const COLLECTION_NAME = "cheating_histories";

const CheatingHistorySchema = new Schema(
    {
        infractionType: {
            type: String,
            required: true,
            enum: ["Face", "Switch Tab", "Screen Capture"],
        },
        description: { type: String },
        exam: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Exam",
        },
        student: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: {
            createdAt: "timeDetected",
            updatedAt: true,
        },
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(CheatingHistorySchema);

CheatingHistorySchema.index({ student: 1, exam: 1, infractionType: 1 });

const CheatingHistory = model(DOCUMENT_NAME, CheatingHistorySchema);

module.exports = CheatingHistory;
