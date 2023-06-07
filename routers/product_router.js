const express = require('express');

const router = express.Router();

const {
    addProduct,
    getProduct,
    getProductById,
    getUserProduct,
    deleteProduct,
    updateProductDetails,
} = require('../controllers/product_controller');

const {
    isAuth
} = require('../middleware/is_auth');

// add product
router.route('/add').post(isAuth, addProduct);

// get all product
router.route('/get').get(isAuth, getProduct);

// get single product
router.route('/get/:id').get(isAuth, getProductById);

// get user all product
router.route('/get-user-products').get(isAuth, getUserProduct);

// delete user product
router.route('/delete/:id').delete(isAuth, deleteProduct);

// update product details
router.route('/update/:id').put(isAuth, updateProductDetails);

module.exports = router;