import mongoose from "mongoose";
import * as uuid from "uuid";

const OrderSchema = new mongoose.Schema(
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

        shippingDate: {
            type: Date,
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

        price: {
            type: Number,
            required: true,
        },

        discountAmount: {
            type: Number,
            required: true,
        },

        hasFreeShipping: {
            type: Boolean,
            required: true,
            default: false,
        },

        subscription: {
            type: String,
            ref: "Subscription",
            required: true,
        },

        recipeVariants: {
            type: [String],
            ref: "RecipeVariant",
        },

        recipeSelection: {
            type: [
                {
                    recipe: {
                        type: String,
                        ref: "Recipe",
                    },
                    quantity: {
                        type: Number,
                    },
                    recipeVariantId: {
                        type: String,
                    },
                },
            ],
            default: [],
        },

        paymentOrder: {
            type: String,
            ref: "PaymentOrder",
            required: true,
        },

        choseByAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },

        firstDateOfRecipesSelection: {
            type: Date,
        },

        lastDateOfRecipesSelection: {
            type: Date,
        },

        customer: {
            type: String,
            ref: "Customer",
            required: true,
        },

        couponCode: {
            type: String,
            default: ""
        },

        counter: {
            type: Number,
            // required: true,
        },
        isFirstOrderOfSubscription: {
            type: Boolean,
        },

        hasBeenMovedOneWeekForward: {
            type: Boolean,
            default: false,
        },

        deletionFlag: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { collection: "Order", timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
