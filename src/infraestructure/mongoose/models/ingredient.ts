import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
    {
        name: {
            es: {
                type: String,
                required: true,
                unique: true,
            },
            en: {
                type: String,
                required: true,
                unique: true,
            },
            ca: {
                type: String,
                required: true,
                unique: true,
            },
        },

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Ingredient", timestamps: true }
);

export const Ingredient = mongoose.model("Ingredient", IngredientSchema);
