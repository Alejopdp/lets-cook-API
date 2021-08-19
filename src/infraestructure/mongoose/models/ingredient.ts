import mongoose from "mongoose";
import * as uuid from "uuid";

const IngredientSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4(),
        },
        name: {
            es: {
                type: String,
                required: true,
                unique: true,
            },
            en: {
                type: String,
                // required: true,
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
