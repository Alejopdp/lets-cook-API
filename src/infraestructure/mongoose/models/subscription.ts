import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const SubscriptionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        planVariant: {
            type: [String],
            ref: "PlanVariant",
            required: true,
        },

        frequency: {
            type: String,
            required: true,
        },

        state: {
            type: String, // Possible an enum
            required: true,
        },
        restrictionComment: {
            type: String,
            required: true,
            default: "",
        },

        billingStartDate: {
            type: Date,
            required: true,
        },

        restrictions: {
            type: [String],
            ref: "RecipeRestriction",
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Subscription", timestamps: true }
);

export const Shipping = mongoose.model("Subscription", SubscriptionSchema);
