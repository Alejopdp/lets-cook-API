import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";
const PlanVariantSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
    },

    name: {
        type: String,
    },

    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },

    priceWithOffer: {
        type: Number,
        required: true,
    },

    numberOfPersons: {
        type: Number,
    },

    numberOfRecipes: {
        type: Number,
    },

    attributes: [
        {
            key: String,
            value: String,
        },
    ],
});

const PlanSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
        name: {
            es: {
                type: String,
                required: true,
            },
            en: {
                type: String,
                // required: true,
            },
        },
        description: {
            es: {
                type: String,
                required: true,
            },
            en: {
                type: String,
                // required: true,
            },
        },

        sku: {
            type: String,
            required: true,
            unique: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },

        isActive: {
            type: Boolean,
        },

        type: {
            type: String,
            required: true,
        },

        variants: [PlanVariantSchema],

        hasRecipes: {
            type: Boolean,
            isRequired: true,
        },

        availableFrequencies: [
            {
                type: String,
                isRequired: true,
            },
        ],

        additionalPlans: {
            type: [String],
            ref: "Plan",
            required: true,
            default: [],
        },

        tools: {
            type: [String],
            default: [],
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },
        abilityToChooseRecipe: {
            type: Boolean,
            default: true,
        },
        iconLinealUrl: {
            type: String,
            required: true,
        },
        iconLinealColorUrl: {
            type: String,
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            isRequired: true,
            default: false,
        },
    },
    { collection: "Plan", timestamps: true }
);

export const Plan = mongoose.model("Plan", PlanSchema);
