import { Schema, model } from "mongoose";

const PostSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        postingList: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const PostSSAFYModel = model("SSAFYUser", PostSchema);

export { PostSSAFYModel };
