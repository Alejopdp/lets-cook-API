import mongoose from "mongoose";
import * as uuid from "uuid";

const SubscriptionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        planVariant: {
            type: String,
            ref: "PlanVariant",
            required: true,
        },

        plan: {
            type: String,
            ref: "Plan",
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

        billingDayOfWeek: {
            type: Number,
            required: true,
        },

        coupon: {
            type: String,
            ref: "Coupon",
        },

        customer: {
            type: String,
            ref: "Customer",
            required: true,
        },

        restrictions: {
            type: [String],
            ref: "RecipeRestriction",
            required: true,
        },

        cancellation: {
            type: {
                reason: {
                    type: String,
                    required: true,
                },
                comment: {
                    type: String,
                },
            },
        },

        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Subscription", timestamps: true }
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
