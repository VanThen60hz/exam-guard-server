const mongoose = require("mongoose");
const { Schema } = mongoose;

const DOCUMENT_NAME = "Question";
const COLLECTION_NAME = "questions";

const QuestionSchema = new Schema(
    {
        questionText: {
            type: String,
            required: true,
        },
        questionType: {
            type: String,
            required: true,
            enum: ["Single Choice", "Multiple Choice", "True/False", "Essay"],
        },
        questionScore: {
            type: Number,
            required: true,
        },
        correctAnswer: {
            type: String,
        },
        options: [String],
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

QuestionSchema.index({ exam: 1, questionType: 1, questionText: "text" });

const Question = mongoose.model(DOCUMENT_NAME, QuestionSchema);

module.exports = Question;
