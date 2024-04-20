const mongoose = require("mongoose");
const Task = require("./Task");

const ColumnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Column = mongoose.model("Column", ColumnSchema);

module.exports = Column;
