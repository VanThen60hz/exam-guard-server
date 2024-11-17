const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "CheatingStatistic";
const COLLECTION_NAME = "cheating_statistics";

const CheatingStatisticSchema = new Schema(
    {
        faceDetectionCount: {
            type: Number,
            default: 0,
        },
        tabSwitchCount: {
            type: Number,
            default: 0,
        },
        screenCaptureCount: {
            type: Number,
            default: 0,
        },
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
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(CheatingStatisticSchema);

CheatingStatisticSchema.index({ student: 1, exam: 1 });

const CheatingStatistic = model(DOCUMENT_NAME, CheatingStatisticSchema);

module.exports = CheatingStatistic;
