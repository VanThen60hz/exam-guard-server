const mongoose = require("mongoose");

const { model, Schema, Types } = mongoose;
const DOCUMENT_NAME = "Answer";
const COLLECTION_NAME = "answers";

const AnswerSchema = new Schema(
    {
        answerText: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
            default: false,
        },
        question: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Question",
        },
        student: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Student",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

AnswerSchema.index({ question: 1, student: 1 });

const Answer = mongoose.model(DOCUMENT_NAME, AnswerSchema);

module.exports = Answer;
