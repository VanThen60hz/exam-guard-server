"use strict";
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const {
    findUserByUserId,
    updateUser,
    deleteUser,
    listUsers,
    searchUsers: repoSearchUsers,
    countUser,
} = require("../repositories/user.repository"); // Đổi tên searchUsers thành repoSearchUsers

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
                "dob",
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
                "dob",
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
        const totalUsers = await countUser(filter);
        const users = await listUsers(filter, page, limit);
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            total: totalUsers,
            totalPages,
            users: users.map((user) =>
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
                        "dob",
                        "address",
                        "phone_number",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: user,
                }),
            ),
        };
    };

    static searchUsers = async (query, page, limit) => {
        const { totalUsers, users } = await repoSearchUsers(query, page, limit); // Gọi searchUsers từ repo
        const totalPages = Math.ceil(totalUsers / limit); // Tính tổng số trang
        return {
            total: totalUsers,
            totalPages,
            users: users.map((user) =>
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
                        "dob",
                        "address",
                        "phone_number",
                        "status",
                        "createdAt",
                        "updatedAt",
                    ],
                    object: user,
                }),
            ),
        };
    };
}

module.exports = UserService;
