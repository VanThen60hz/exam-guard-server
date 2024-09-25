"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const { findUserByUserId, updateUser, deleteUser, listUsers, searchUsers } = require("../repositories/user.repository");

class UserService {
    static findUserById = async (userId) => {
        const user = await findUserByUserId(userId);
        if (!user) {
            throw new BadRequestError("User not found");
        }
        return getInfoData({
            fields: [
                "_id",
                "username",
                "name",
                "email",
                "role",
                "avatar",
                "gender",
                "ssn",
                "address",
                "phone_number",
                "status",
                "createdAt",
                "updatedAt",
            ],
            object: user,
        });
    };

    static updateUser = async (userId, userData) => {
        const updatedUser = await updateUser(userId, userData);
        if (!updatedUser) {
            throw new BadRequestError("User not found");
        }
        return getInfoData({
            fields: [
                "_id",
                "username",
                "name",
                "email",
                "role",
                "avatar",
                "gender",
                "ssn",
                "address",
                "phone_number",
                "status",
                "createdAt",
                "updatedAt",
            ],
            object: updatedUser,
        });
    };

    static deleteUser = async (userId) => {
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
            throw new BadRequestError("User not found");
        }
        return { message: "User deleted successfully" };
    };

    static listUsers = async (filter = {}, page, limit) => {
        const users = await listUsers(filter, page, limit);
        return users.map((user) =>
            getInfoData({
                fields: [
                    "_id",
                    "username",
                    "name",
                    "email",
                    "role",
                    "avatar",
                    "gender",
                    "ssn",
                    "address",
                    "phone_number",
                    "status",
                    "createdAt",
                    "updatedAt",
                ],
                object: user,
            }),
        );
    };

    static searchUsers = async (query, page, limit) => {
        const users = await searchUsers(query, page, limit);

        return users.map((user) =>
            getInfoData({
                fields: [
                    "_id",
                    "username",
                    "name",
                    "email",
                    "role",
                    "avatar",
                    "gender",
                    "ssn",
                    "address",
                    "phone_number",
                    "status",
                    "createdAt",
                    "updatedAt",
                ],
                object: user,
            }),
        );
    };
}

module.exports = UserService;
