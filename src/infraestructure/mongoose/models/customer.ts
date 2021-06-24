import mongoose from "mongoose";
import * as uuid from "uuid";

const CustomerSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
        },
        password: {
            type: String,
        },
        state: {
            type: String,
            required: true
        },
        codeToRecoverPassword: {
            type: String
        },
        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Customer", timestamps: true }
);

export const Customer = mongoose.model("Customer", CustomerSchema);
