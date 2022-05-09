import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        commitCount: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = model("User", UserSchema);

export { UserModel };
