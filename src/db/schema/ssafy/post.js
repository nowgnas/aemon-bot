import { Schema, model } from "mongoose";

const AssignmentSchema = new Schema(
    {
        assign: {
            type: [String],
            required: false,
        },
        state: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const AssignmentSchemaModel = model("Assignment", AssignmentSchema);

export { AssignmentSchemaModel };
