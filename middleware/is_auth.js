const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    try {
        const token = req.header('token');

        const verifiedData = jwt.verify(token, "OMGTest");

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