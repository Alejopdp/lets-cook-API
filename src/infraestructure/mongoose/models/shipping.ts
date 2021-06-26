import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const ShippingZoneSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        name: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
            required: false,
        },
        cost: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            required: false,
        },
        radio: {
            type: [
                {
                    latitude: {
                        type: Number,
                        required: true,
                    },
                    longitude: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
        shippingDayOfWeek: {
            type: Number,
            required: true,
        },
        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "ShippingZone", timestamps: true }
);

export const Shipping = mongoose.model("ShippingZone", ShippingZoneSchema);
