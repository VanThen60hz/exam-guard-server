"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { teacherAuthentication, authentication } = require("../../auth/authUtils");
const router = express.Router();

module.exports = router;
