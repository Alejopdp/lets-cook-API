import mongoose from "mongoose";
import * as uuid from "uuid";

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },

        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        isEmailVerified: {
            type: Boolean,
            required: true,
        },

        password: {
            type: String,
        },

        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },

        isActivated: {
            type: Boolean,
            required: true,
        },

        deletionFlag: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "User", timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
