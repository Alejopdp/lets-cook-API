import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const PaymentOrderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },

        paymentIntentId: {
            type: String,
        },

        shippingDate: {
            type: Date,
            required: true,
        },

        customer: {
            type: String,
            ref: "Customer",
            required: true,
        },

        state: {
            type: String, // Possible an enum
            required: true,
        },

        week: {
            type: String,
            ref: "Week",
            required: true,
        },

        billingDate: {
            type: Date,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        discountAmount: {
            type: Number,
            required: true,
        },

        shippingCost: {
            type: Number,
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "PaymentOrder", timestamps: true }
);

export const PaymentOrder = mongoose.model("PaymentOrder", PaymentOrderSchema);
