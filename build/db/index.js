"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "UserModel", {
  enumerable: true,
  get: function () {
    return _user.UserModel;
  }
});

var _mongoose = _interopRequireDefault(require("mongoose"));

require("dotenv/config");

var _user = require("./schema/user");

const DB_URL = `${process.env.MONGODB_URL}/${process.env.CLUSTER_NANE}?retryWrites=true&w=majority`;

_mongoose.default.connect(DB_URL);

const db = _mongoose.default.connection;
db.on("connected", () => console.log("Database connection success cluster: " + process.env.CLUSTER_NANE));
db.on("error", error => console.error(`********************\nDatabase connection error....\nCannot connect to ${process.env.CLUSTER_NANE}\n********************\n ${error}`));