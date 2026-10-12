const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getUser = async (request, respose, next) => {
    const authorization = request.get("authorization");

    if (authorization && authorization.startsWith("authorization")) {
        const decodedToken = jwt.verify(
            authorization.replace("authorization ", ""),
            process.env.SECRET,
        );

        const user = await User.findById(decodedToken.id);
        request.user = user;
    }
};

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(404).json({ error: "malformed id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError") {
        return response
            .status(409)
            .json({ error: "User with this username already exists" });
    }
    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    getUser,
};
