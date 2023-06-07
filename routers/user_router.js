const express = require('express');

const router = express.Router();

const {
    signUp,
    logIn,
    getUserDetails,
    changePassword,
    updateUserDetails,
    uploadImage,
} = require('../controllers/user_controller');

const {
    isAuth
} = require('../middleware/is_auth')

// create account
router.route('/create-user').post(signUp);


// login user
router.route('/login').post(logIn);

// get single user by id
router.route('/get').get(isAuth, getUserDetails);

// change user password
router.route('/change-password').put(isAuth, changePassword);

// update user user
router.route('/update').put(isAuth, updateUserDetails);

// upload profile image
router.route('/upload/image').patch(isAuth, uploadImage);

module.exports = router;