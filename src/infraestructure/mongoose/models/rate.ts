import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const RateSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        rateValue: {
            type: Number
        },
        comment: {
            type: String
        },
        customerId: {
            type: String,
            required: true
        },
        recipeId: {
            type: String,
            required: true
        },
        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Rate", timestamps: true }
);

export const Rate = mongoose.model("Rate", RateSchema);
