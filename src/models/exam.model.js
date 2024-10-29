const mongoose = require("mongoose");

const { model, Schema, Types } = mongoose;
const DOCUMENT_NAME = "Exam";
const COLLECTION_NAME = "exams";

const ExamSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
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

ExamSchema.index({ teacher: 1, title: "text", status: 1 });

const Exam = mongoose.model(DOCUMENT_NAME, ExamSchema);

module.exports = Exam;
