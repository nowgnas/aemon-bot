"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostSSAFYModel = void 0;

var _mongoose = require("mongoose");

const PostSchema = new _mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  postingList: {
    type: [String],
    required: false
  }
}, {
  timestamps: true
});
const PostSSAFYModel = (0, _mongoose.model)("SSAFYUser", PostSchema);
exports.PostSSAFYModel = PostSSAFYModel;