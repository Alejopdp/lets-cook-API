import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const RateSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        rating: {
            type: Number,
            default: 0,
        },
        comment: {
            type: String,
        },
        customer: {
            type: String,
            ref: "Customer",
            required: true,
        },
        recipe: {
            type: String,
            ref: "Recipe",
            required: true,
        },
        qtyDelivered: {
            type: Number,
            required: true,
        },
        lastShippingDate: {
            type: Date,
            required: true,
        },
        beforeLastShippingDate: {
            type: Date,
            required: true,
        },
        shippingDates: [
            {
                type: Date,
            },
        ],
        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Rate", timestamps: true }
);

export const Rate = mongoose.model("Rate", RateSchema);
