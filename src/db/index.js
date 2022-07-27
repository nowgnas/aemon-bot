import mongoose from "mongoose";
import "dotenv/config";
import { UserModel } from "./schema/user";
import { SSAFYUserModel } from "./schema/ssafy/commit";
import { AssignmentSchemaModel } from "./schema/ssafy/post";

const DB_URL = `${process.env.MONGODB_URL}/${process.env.CLUSTER_NANE}?retryWrites=true&w=majority`;

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", () =>
    console.log(
        "Database connection success cluster: " + process.env.CLUSTER_NANE
    )
);
db.on("error", (error) =>
    console.error(
        `********************\nDatabase connection error....\nCannot connect to ${process.env.CLUSTER_NANE}\n********************\n ${error}`
    )
);

export { UserModel, SSAFYUserModel, AssignmentSchemaModel };
