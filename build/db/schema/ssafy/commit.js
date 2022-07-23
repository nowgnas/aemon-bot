"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SSAFYUserModel = void 0;

var _mongoose = require("mongoose");

const SSAFYUserSchema = new _mongoose.Schema({
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
  },
  posting: {
    type: [String],
    required: false
  }
}, {
  timestamps: true
});
const SSAFYUserModel = (0, _mongoose.model)("SSAFYUser", SSAFYUserSchema);
exports.SSAFYUserModel = SSAFYUserModel;