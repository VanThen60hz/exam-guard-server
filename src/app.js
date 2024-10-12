const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const examCron = require("./cron/examCron"); // Ensure this is imported

// init middlewares
app.use(express.json()); // Thêm middleware để phân tích cú pháp JSON
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());
// init db
require("./dbs/init.mongodb");

// Start the cron job

// examCron();

// init routes
app.use("/", require("./routers"));

// handle error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});

// handle error
module.exports = app;

/// TEST
// const express = require("express");
