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
        required: true,
    },
});

const RecipeRestriction = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },

    value: {
        type: {
            type: String,
        },
    },
});

const RecipeVariant = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
    },

    ingredients: [
        {
            type: String,
            required: true,
        },
    ],

    restrictions: [RecipeRestriction],
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

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Recipe", timestamps: true }
);

export const Recipe = mongoose.model("Recipe", RecipeSchema);
