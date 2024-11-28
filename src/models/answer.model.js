const { addTimestampsMiddleware } = require("../utils/dateHelper");
const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Answer";
const COLLECTION_NAME = "answers";

const AnswerSchema = new Schema(
    {
        answerText: {
            type: String,
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
            ref: "User",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

addTimestampsMiddleware(AnswerSchema);

AnswerSchema.index({ question: 1, student: 1 });

const Answer = model(DOCUMENT_NAME, AnswerSchema);

module.exports = Answer;
