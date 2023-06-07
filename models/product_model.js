const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [
                true,
                "Please enter the product title"
            ],
        },
        price: {
            type: Number,
            required: [
                true,
                "Please enter the price"
            ],
        },
        image: {
            type: String,
            default: "",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Product", productSchema);