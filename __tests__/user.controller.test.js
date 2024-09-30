const UserController = require("../src/controllers/user.controller");
const UserService = require("../src/services/user.service");
const { SuccessResponse } = require("../src/core/success.response");

jest.mock("../src/services/user.service");

describe("UserController", () => {
    let userController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        userController = new UserController();
        req = { query: {}, params: {}, body: {} };
        res = { send: jest.fn() };
        next = jest.fn();
    });

    describe("searchUsers", () => {
        it("should return search results", async () => {
            req.query.query = "test";
            req.query.page = 1;
            req.query.limit = 10;

            UserService.searchUsers.mockResolvedValue({
                total: 1,
                totalPages: 1,
                users: [{ username: "testuser", email: "test@example.com" }],
            });

            await userController.searchUsers(req, res, next);

            expect(res.send).toHaveBeenCalledWith({
                message: "Search results retrieved successfully",
                metadata: {
                    total: 1,
                    totalPages: 1,
                    users: [{ username: "testuser", email: "test@example.com" }],
                },
            });
        });
    });

    describe("listUsers", () => {
        it("should return list of users", async () => {
            req.query.role = "STUDENT";
            req.query.page = 1;
            req.query.limit = 10;

            UserService.listUsers.mockResolvedValue({
                total: 1,
                totalPages: 1,
                users: [{ username: "student1", role: "STUDENT" }],
            });

            await userController.listUsers(req, res, next);

            expect(res.send).toHaveBeenCalledWith({
                message: "List of users retrieved successfully",
                metadata: {
                    total: 1,
                    totalPages: 1,
                    users: [{ username: "student1", role: "STUDENT" }],
                },
            });
        });
    });
});
