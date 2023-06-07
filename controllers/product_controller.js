const ProductModel = require('../models/product_model');

// route: /api/products/add
// Private
const addProduct = async (req, res, next) => {
    try {
        const { title, price, image } = req.body;

        const userId = req.userId;

        const product = await ProductModel({
            title,
            price,
            image,
            creator: userId
        })

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product added",
            product,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/products/get
// Private
const getProduct = async (req, res, next) => {
    try {
        const products = await ProductModel.find();

        return res.status(201).json({
            success: true,
            message: "Product found",
            products,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/products/get/:id
// Private
const getProductById = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const product = await ProductModel.findById(productId).populate("creator", "name");

        if (!product) {
            const error = new Error("Product not found")
            error.statusCode = 404;
            throw error;
        }

        return res.status(201).json({
            success: true,
            message: "Product found",
            product,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/products/get-user-products
// Private
const getUserProduct = async (req, res, next) => {
    try {
        const userId = req.userId;

        const products = await ProductModel.find({ creator: userId });

        if (!products) {
            return res.status(201).json({
                success: true,
                message: "Products found",
                products: [],
            })
        }

        return res.status(201).json({
            success: true,
            message: "Products found",
            products,
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/products/delete/:id
// Private
const deleteProduct = async (req, res, next) => {
    try {
        const userId = req.userId;

        const productId = req.params.id;

        const product = await ProductModel.findById(productId);

        if (!product) {
            const error = new Error("Product not found")
            error.statusCode = 404;
            throw error;
        }

        if (product.creator != userId) {
            const error = new Error("You don't have permission to delete")
            error.statusCode = 403;
            throw error;
        }

        await ProductModel.findByIdAndRemove(productId);

        return res.status(201).json({
            success: true,
            message: "Product deleted",
        })

    } catch (error) {
        next(error);
    }
}

// route: /api/products/update/:id
// Private
const updateProductDetails = async (req, res, next) => {
    try {
        const userId = req.userId;

        const productId = req.params.id;

        const product = await ProductModel.findById(productId);

        if (!product) {
            const error = new Error("Product not found")
            error.statusCode = 404;
            throw error;
        }

        if (product.creator != userId) {
            const error = new Error("You don't have permission to delete")
            error.statusCode = 403;
            throw error;
        }

        const { title, price } = req.body;

        product.title = title;
        product.price = price;
        await product.save();

        res.status(200).json({
            success: true,
            message: "Updated successful",
            product,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    addProduct,
    getProduct,
    getProductById,
    getUserProduct,
    deleteProduct,
    updateProductDetails,
}