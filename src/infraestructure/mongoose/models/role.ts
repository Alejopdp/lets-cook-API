import mongoose from "mongoose";
import { logger } from "../../../../config";
import { Permission } from "../../../bounded_contexts/IAM/domain/permission/Permission";

const RoleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },

        permissions: [
            {
                type: String,
                enum: Permission,
                required: true,
            },
        ],
    },
    { collection: "Role", timestamps: true }
);

export const Role = mongoose.model("Role", RoleSchema);
