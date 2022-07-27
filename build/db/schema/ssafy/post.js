"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssignmentSchemaModel = void 0;

var _mongoose = require("mongoose");

const AssignmentSchema = new _mongoose.Schema({
  assign: {
    type: [String],
    required: false
  },
  state: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
const AssignmentSchemaModel = (0, _mongoose.model)("Assignment", AssignmentSchema);
exports.AssignmentSchemaModel = AssignmentSchemaModel;