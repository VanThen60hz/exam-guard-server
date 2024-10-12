const mongoose = require("mongoose");

const { model, Schema, Types } = mongoose;
const DOCUMENT_NAME = "Exam";
const COLLECTION_NAME = "exams";

const ExamSchema = new Schema(
    {
        teacher: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            required: true,
            enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
            default: "Scheduled",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const Exam = mongoose.model(DOCUMENT_NAME, ExamSchema);

module.exports = Exam;
