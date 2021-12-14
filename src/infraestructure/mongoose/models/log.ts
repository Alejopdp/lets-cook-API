import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const LogSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        type: {
            type: String,
        },
        user: {
            type: String,
        },
        role: {
            type: String,
        },

        action: {
            type: String,
            required: true,
        },
        debugAction: {
            type: String,
            required: true,
        },
        customerId: {
            type: String,
            isRequired: true,
            ref: "Customer",
        },
    },
    { collection: "Log", timestamps: true }
);

export const Log = mongoose.model("Log", LogSchema);
