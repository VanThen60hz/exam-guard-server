const mongoose = require("mongoose");

const { model, Schema } = mongoose;
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

GradeSchema.index({ exam: 1, student: 1 });

const Grade = mongoose.model(DOCUMENT_NAME, GradeSchema);

module.exports = Grade;
