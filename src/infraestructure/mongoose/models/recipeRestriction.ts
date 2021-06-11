import mongoose from "mongoose";
import * as uuid from "uuid";

const RecipeVariantRestrictionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },

        label: {
            type: String,
            required: true,
        },

        value: {
            type: String,
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "RecipeVariantRestriction", timestamps: true }
);

export const RecipeVariantRestriction = mongoose.model("RecipeVariantRestriction", RecipeVariantRestrictionSchema);
