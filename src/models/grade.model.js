"use strict";

const { addTimestampsMiddleware } = require("../utils/dateHelper");

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Grade";
const COLLECTION_NAME = "grades";

const GradeSchema = new Schema(
    {
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        feedback: {
            type: String,
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

addTimestampsMiddleware(GradeSchema);

GradeSchema.index({ exam: 1, student: 1 });

const Grade = model(DOCUMENT_NAME, GradeSchema);

module.exports = Grade;
