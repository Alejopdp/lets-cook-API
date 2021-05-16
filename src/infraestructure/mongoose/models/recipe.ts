import mongoose, { Mongoose } from "mongoose";
import * as uuid from "uuid";

const RecipeDescription = new mongoose.Schema({
    shortDescription: {
        type: String,
    },

    longDescription: {
        type: String,
    },
});

const RecipeGeneralData = new mongoose.Schema({
    name: { type: String, required: true },
    recipeDescription: RecipeDescription,
});

const RecipeSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4,
    },
});
