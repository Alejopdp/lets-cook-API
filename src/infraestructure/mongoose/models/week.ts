import mongoose from "mongoose";
import * as uuid from "uuid";

const WeekSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        minDay: {
            type: Date,
            required: true,
        },

        maxDay: {
            type: Date,
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            default: false
        }
    },
    { collection: "Week", timestamps: true }
);

export const Week = mongoose.model("Week", WeekSchema);
