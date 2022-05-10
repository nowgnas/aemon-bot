"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserModel = void 0;

var _mongoose = require("mongoose");

const UserSchema = new _mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  commitDay: {
    type: [String],
    required: false
  }
}, {
  timestamps: true
});
const UserModel = (0, _mongoose.model)("User", UserSchema);
exports.UserModel = UserModel;