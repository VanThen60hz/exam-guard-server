"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// // check apiKey
// router.use(apiKey);

// // check permission
// router.use(permission("0000"));

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
