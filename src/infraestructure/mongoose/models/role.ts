import mongoose from "mongoose";
import { logger } from "../../../../config";
import { Permission } from "../../../bounded_contexts/IAM/domain/permission/Permission";
import * as uuid from "uuid";

const RoleSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuid.v4,
        },
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
