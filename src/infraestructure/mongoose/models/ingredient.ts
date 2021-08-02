import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Ingredient", timestamps: true }
);

export const Ingredient = mongoose.model("Ingredient", IngredientSchema);
