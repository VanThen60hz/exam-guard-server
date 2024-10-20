const mongoose = require("mongoose");
const { Schema } = mongoose;

const DOCUMENT_NAME = "Question";
const COLLECTION_NAME = "questions";

const QuestionSchema = new Schema(
    {
        exam: {
            type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
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
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const Question = mongoose.model(DOCUMENT_NAME, QuestionSchema);

module.exports = Question;
