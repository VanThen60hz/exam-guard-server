const mongoose = require("mongoose");

const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, required: true, enum: ["ADMIN", "TEACHER", "STUDENT"] },
        email: { type: String, required: true, unique: true },
        avatar: { type: String, default: "" },
        gender: { type: String, required: true, enum: ["MALE", "FEMALE"] },
        ssn: { type: Number, required: true },
        address: { type: String },
        phone_number: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collectionName: COLLECTION_NAME,
    },
);

const User = mongoose.model(DOCUMENT_NAME, userSchema);

module.exports = User;
