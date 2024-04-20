const mongoose = require("mongoose");

const assignedSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (assuming you have a User model)
    required: true,
  },
  invitedUser: {
    type: String,

    required: true,
  },

  role: {
    type: String,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board", // Reference to the Board model
    required: true,
  },
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Reference to the Task model
    },
  ],
});

const Assigned = mongoose.model("Assigned", assignedSchema);

module.exports = Assigned;
