import mongoose from "mongoose";
import * as uuid from "uuid";

const WalletMovementLogSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },

        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
        },
        descripion: {
            type: String,
        },

        customer: {
            type: String,
            ref: "Customer",
            required: true,
            index: true,
        },
    },
    { collection: "WalletMovementLog", timestamps: true }
);

export const WalletMovementLog = mongoose.model("WalletMovementLog", WalletMovementLogSchema);
