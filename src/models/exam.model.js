"use strict";

const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Exam";
const COLLECTION_NAME = "exams";

const ExamSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        duration: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["Scheduled", "In Progress", "Completed", "Canceled"],
            default: "Scheduled",
        },
        teacher: {
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

addTimestampsMiddleware(ExamSchema);

ExamSchema.index({ teacher: 1, title: "text", status: 1 });

const Exam = model(DOCUMENT_NAME, ExamSchema);

module.exports = Exam;
