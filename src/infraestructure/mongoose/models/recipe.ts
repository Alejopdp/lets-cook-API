import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const RecipeDescription = new mongoose.Schema({
    shortDescription: {
        type: String,
        required: true,
    },

    longDescription: {
        type: String,
        required: true,
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
    name: { type: String, required: true },
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

const RecipeVariant = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
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
                key: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
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
