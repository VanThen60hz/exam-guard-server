const mongoose = require("mongoose");

const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

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
        dob: { type: Date, required: true },
        address: { type: String },
        phone_number: { type: String, required: true },
        status: { type: String, required: true, enum: ["ACTIVE", "INACTIVE", "SUSPENDED"], default: "INACTIVE" },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

userSchema.index({
    username: "text",
    email: "text",
    name: "text",
    address: "text",
    phone_number: "text",
});

const User = mongoose.model(DOCUMENT_NAME, userSchema);

module.exports = User;
