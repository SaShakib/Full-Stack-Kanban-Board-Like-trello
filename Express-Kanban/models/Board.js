// models/board.js
const mongoose = require("mongoose");
const User = require("./User"); // Import UserSchema
const Column = require("./Column"); // Import ColumnSchema

const BoardSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference UserSchema
  name: { type: String, required: true },
  access: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference UserSchema in an array
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }], // Reference ColumnSchema in an array
});

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;
