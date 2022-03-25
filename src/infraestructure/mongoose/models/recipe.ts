import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const RecipeDescription = new mongoose.Schema({
    shortDescription: {
        es: { type: String },
        en: { type: String },
        ca: { type: String },
    },

    longDescription: {
        es: { type: String, required: true },
        en: { type: String },
        ca: { type: String },
    },
});

const RecipeCookDuration = new mongoose.Schema({
    timeValue: {
        type: Number,
        required: true,
    },

    timeUnit: {
        type: String,
        required: true,
    },
});

const RecipeWeight = new mongoose.Schema({
    weightValue: {
        type: Number,
        required: true,
    },

    weightUnit: {
        type: String,
        required: true,
    },
});

const RecipeGeneralData = new mongoose.Schema({
    name: {
        es: { type: String, required: true },
        en: { type: String },
        ca: { type: String },
    },
    recipeDescription: RecipeDescription,
    recipeCookDuration: RecipeCookDuration,
    recipeWeight: RecipeWeight,
    difficultyLevel: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },

    imageUrl: {
        type: String,
        // required: true,
    },

    imagesUrls: [
        {
            type: String,
            required: true,
        },
    ],
});

RecipeGeneralData.index({ sku: 1 }, { unique: true });

const RecipeVariant = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
    },

    ingredients: [
        {
            type: String,
            ref: "Ingredient",
            required: true,
        },
    ],

    restriction: {
        type: String,
        ref: "RecipeVariantRestriction",
    },
});

RecipeVariant.index({ sku: 1 }, { unique: true });

const RecipeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },

        recipeGeneralData: RecipeGeneralData,
        recipeVariants: [RecipeVariant],
        imageTags: [
            {
                type: String,
            },
        ],
        nutritionalInfo: [
            {
                es: {
                    key: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    },
                },
                en: {
                    key: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    },
                },
                ca: {
                    key: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    },
                },
            },
        ],

        backOfficeTags: [
            {
                type: String,
            },
        ],

        tools: [
            {
                type: String,
            },
        ],

        availableMonths: [
            {
                type: String,
            },
        ],

        availableWeeks: {
            type: [String],
            ref: "Week",
            default: [],
        },

        relatedPlans: {
            type: [String],
            ref: "Plan",
            required: true,
            default: [],
        },

        orderPriority: {
            type: Number,
        },

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Recipe", timestamps: true }
);

export const Recipe = mongoose.model("Recipe", RecipeSchema);
