const express = require('express');

const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const mongodb = process.env.MONGODBLINK;

// Image upload data
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
})

app.use(upload.single('image'));
app.use('/uploads', express.static('uploads'));

// Product Router
const productRouter = require('./routers/product_router');
app.use('/api/products', productRouter);

// User Router
const userRouter = require('./routers/user_router');
app.use('/api/user', userRouter);



// common error handler
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    const success = false;

    res.status(status).json({
        message,
        success,
        data
    });
})

mongoose.connect(mongodb)
    .then((value) => {
        console.log('MongoDB is connnected');

        app.listen(port, () => {
            console.log('Server is running on port', port);
        })
    })
    .catch((error) => {
        app.use((req, res, next) => {
            const errors = new Error("Server is down!, please try again later");
            errors.statusCode = 500;
            errors.data = error;

            next(errors);
        });
    });