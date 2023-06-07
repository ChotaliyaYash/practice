const UserModel = require('../models/user_model')

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

// route: /api/user/create-user
// Public
const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const alreadyUser = await UserModel.findOne({ email: email });

        if (alreadyUser) {
            const error = new Error("Email already registered!");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Account created!, login with same details",
            user
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/user/login
// Public
const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            const error = new Error("Account not found!, try to signup");
            error.statusCode = 404;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            "OMGTest",
            {
                expiresIn: '1d'
            }
        )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userId: user._id,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/user/get
// Private
const getUserDetails = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            const error = new Error("Account not found!, try to signup");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Data found",
            user,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/user/change-password
// Private
const changePassword = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            const error = new Error("Account not found!, try to signup");
            error.statusCode = 404;
            throw error;
        }

        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            const error = new Error("Please provide both old and new password");
            error.statusCode = 404;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(confirmPassword, constants.SALT);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Updated",
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/user/update
// Private
const updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            const error = new Error("Account not found!, try to signup");
            error.statusCode = 404;
            throw error;
        }

        const { name } = req.body;

        if (!name) {
            const error = new Error("All fields are mandetory");
            error.statusCode = 404;
            throw error;
        }

        user.name = name;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile update",
            user,
        });

    } catch (error) {
        next(error);
    }
}

// route: /api/user/upload/image
// Private
const uploadImage = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            const error = new Error("Account not found!, try to signup");
            error.statusCode = 404;
            throw error;
        }

        if (!req.file) {
            const error = new Error("No file selected");
            error.statusCode = 422;
            throw error;
        }

        const image = req.file.path;

        console.log(image.toString());

        user.image = image;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Image uploded successfully",
            user,
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    signUp,
    logIn,
    getUserDetails,
    changePassword,
    updateUserDetails,
    uploadImage
}
