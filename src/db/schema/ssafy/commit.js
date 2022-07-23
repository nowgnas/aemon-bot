import { Schema, model } from "mongoose";

const SSAFYUserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        commitDay: {
            type: [String],
            required: false,
        },
        posting: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const SSAFYUserModel = model("SSAFYUser", SSAFYUserSchema);

export { SSAFYUserModel };
