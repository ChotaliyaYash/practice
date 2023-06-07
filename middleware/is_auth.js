const constants = require('../constants/constants');

const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    try {
        const token = req.header('token');

        const verifiedData = jwt.verify(token, constants.JWTSTRING);

        if (!verifiedData) {
            const error = new Error("Token Expired");
            error.statusCode = 403;
            throw error;
        }

        req.userId = verifiedData["userId"];
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = {
    isAuth,
}