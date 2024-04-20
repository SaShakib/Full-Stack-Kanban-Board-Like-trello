const mongoose = require("mongoose");
const User = require("./User");

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Assuming it represents the user's email
  content: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  subtasks: [
    {
      _id: { type: String, required: true },
      task: { type: String, required: true },
      checked: { type: Boolean, default: false },
    },
  ],
  name: { type: String, required: true },
  deadlineStart: { type: Date },
  deadlineEnd: { type: Date },
  label: { type: String },
  color: { type: String },
  image: { type: String }, // Assuming it stores the URL of the image
  comment: [CommentSchema],
  resource: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  // Array of text URLsa
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Comment = mongoose.model("Comment", CommentSchema);
const Task = mongoose.model("Task", TaskSchema);

module.exports = { Comment, Task };

