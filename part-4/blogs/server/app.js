const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

const connectToDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, { family: 4 });
        logger.info("connected to MongoDB");
    } catch (error) {
        logger.error(`error connecting to mongoDB:${error}`);
    }
};

connectToDB();

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
