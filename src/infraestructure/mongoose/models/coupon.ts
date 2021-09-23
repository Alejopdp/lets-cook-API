import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const CouponSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        couponCode: {
            type: String,
            required: true,
        },
        type: {
            type: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
                required: false,
            },
        },
        minRequireType: {
            type: String,
            required: true,
        },
        minRequireValue: {
            type: Number,
            required: false,
        },
        productsForApplyingType: {
            type: String,
            required: true,
        },
        productsForApplyingValue: {
            type: [String],
            ref: "Plan",
            required: true,
            default: [],
        },
        limites: {
            type: [
                {
                    type: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: Number,
                        required: false,
                    },
                },
            ],
        },
        maxChargeQtyType: {
            type: String,
            required: true,
        },
        maxChargeQtyValue: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: false,
        },
        state: {
            type: String,
            required: true,
        },
        quantityApplied: {
            type: Number,
            required: true,
            default: 0,
        },

        customersWhoHaveApplied: {
            type: [String],
            required: true,
            default: [],
            ref: "Customer",
        },
        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Coupon", timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
