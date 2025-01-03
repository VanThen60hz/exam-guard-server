"use strict";

const QuestionTypes = require("../constants/questionType");
const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { Schema, model } = require("mongoose");

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
            enum: Object.values(QuestionTypes),
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

addTimestampsMiddleware(QuestionSchema);

QuestionSchema.index({ exam: 1, questionType: 1, questionText: "text" });

const Question = model(DOCUMENT_NAME, QuestionSchema);

module.exports = Question;
