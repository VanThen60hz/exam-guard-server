const UserRoles = Object.freeze({
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
});

const Genders = Object.freeze({
    MALE: "MALE",
    FEMALE: "FEMALE",
});

const UserStatus = Object.freeze({
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
});

module.exports = {
    UserRoles,
    Genders,
    UserStatus,
};
