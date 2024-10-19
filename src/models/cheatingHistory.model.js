const mongoose = require("mongoose");

const { model, Schema } = mongoose;
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
        timeDetected: { type: Date, required: true, default: Date.now },
        student: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        exam: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Exam",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const CheatingHistory = mongoose.model(DOCUMENT_NAME, CheatingHistorySchema);

module.exports = CheatingHistory;
