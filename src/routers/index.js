"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission
// router.use(permission("0000"));

// cheating router
router.use("/api/cheating", require("./cheating"));

// grade router
router.use("/api/grade", require("./grade"));

// answer router
router.use("/api/answer", require("./answer"));

// exam router
router.use("/api/question", require("./question"));

// exam router
router.use("/api/exam", require("./exam"));

// user router
router.use("/api/user", require("./user"));

// access router
router.use("/api/auth", require("./access"));

// router.get("/", (req, res, next) => {
//     return res.status(200).json({
//         message: "Hello World",
//     });
// });

module.exports = router;
