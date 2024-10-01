const UserService = require("../src/services/user.service");
const userRepository = require("../src/repositories/user.repository");

jest.mock("../src/repositories/user.repository");

describe("UserService", () => {
    describe("searchUsers", () => {
        it("should return users with pagination", async () => {
            const mockUsers = [{ username: "teacher123", email: "nguyenvanteacher@example.com" }];
            userRepository.searchUsers.mockResolvedValue({ totalUsers: 1, users: mockUsers });

            const result = await UserService.searchUsers("test", 1, 10);

            expect(result).toEqual({
                total: 1,
                totalPages: 1,
                users: mockUsers,
            });
        });
    });

    describe("listUsers", () => {
        it("should return users with role filter", async () => {
            const mockUsers = [{ username: "teacher123", role: "TEACHER" }];
            userRepository.listUsers.mockResolvedValue({ total: 1, users: mockUsers });

            const result = await UserService.listUsers({ role: "TEACHER" }, 1, 10);

            expect(result).toEqual({
                total: 1,
                totalPages: 1,
                users: mockUsers,
            });
        });
    });
});
