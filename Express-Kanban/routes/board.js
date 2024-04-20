const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const Board = require("../models/Board");
const Column = require("../models/Column");
const { Task, Comment } = require("../models/Task");
const Assigned = require("../models/Assigned");
const User = require("../models/User");

// Route to create a board with columns and empty task lists
router.post("/createBoard", authMiddleware, async (req, res) => {
  try {
    const { name, columns } = req.body;
    const ownerId = req.user._id; // Assuming user ID is stored in req.user from authMiddleware

    // Create columns with empty task lists
    const createdColumns = await Promise.all(
      columns.map(async (columnData) => {
        const { board } = columnData;
        // Create an empty column
        const createdColumn = await Column.create({
          name: board,
          taskList: [],
          owner: ownerId, // Assign the owner ID to the column
        });
        return createdColumn;
      })
    );

    // Extract column IDs
    const columnIds = createdColumns.map((column) => column._id);

    // Create the board
    const createdBoard = await Board.create({
      name,
      owner: ownerId,
      access: [], // You might want to specify access here
      columns: columnIds,
    });

    // Populate the owner field in the created board with name and email
    await Board.populate(createdBoard, {
      path: "owner",
      select: "name email",
    });

    // Populate the access field in the created board with name and email
    await Board.populate(createdBoard, {
      path: "access",
      select: "name email",
    });
    await Board.populate(createdBoard, {
      path: "columns",
      select: "name taskList",
    });
    // Populate all fields in each created column
    await Column.populate(createdColumns, {
      path: "taskList",
    });

    // Populate the taskList field in each column inside the created board
    await Board.populate(createdBoard, {
      path: "columns.taskList",
    });
    console.log({ board: createdBoard });
    res.json({ message: "Board created successfully", board: createdBoard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating board" });
  }
});

router.get("/boards/:email", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Assuming user ID is stored in req.user from authMiddleware
    const boards = await Board.find({ owner: user._id });

    // Populate fields as needed
    // For example, you might want to populate owner, access, columns, etc.
    await Board.populate(boards, {
      path: "owner",
      select: "name email",
    });

    // Populate the access field in the created board with name and email
    await Board.populate(boards, {
      path: "access",
      select: "name email",
    });
    await Board.populate(boards, {
      path: "columns",
      select: "name taskList ",
    });
    // Populate all fields in each created column

    // Populate the taskList field in each column inside the created board
    await Board.populate(boards, {
      path: "columns.taskList",
    });

    await Board.populate(boards, {
      path: "columns.taskList.assignedList",
    });

    res.json({ boards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reading boards" });
  }
});

router.get("/board/:id", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Assuming user ID is stored in req.user from authMiddleware
    const board = await Board.findById(req.params.id);

    // Populate fields as needed
    // For example, you might want to populate owner, access, columns, etc.

    res.json({ board });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reading the board" });
  }
});

router.post("/add_column/", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Assuming user ID is stored in req.user from authMiddleware
    const { name, boardId } = req.body;
    const ownerId = req.user._id;

    // Create an empty column
    const createdColumn = await Column.create({
      name,
      taskList: [],
      owner: ownerId,
    });

    // Find the board by ID
    const board = await Board.findById(boardId);

    // Add the new column to the board's columns array
    board.columns.push(createdColumn);

    // Save the updated board
    await board.save();

    // Populate fields as needed
    // For example, you might want to populate owner, access, columns, etc.

    res.json({ message: "Column added to the board", createdColumn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding column to the board" });
  }
});

router.post("/tasks/createTask", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      subTasks,
      status,
      deadline,
      startDate,
      label,
      color,
      image,
      members,
      activeBoard,
    } = req.body;
    const ownerId = req.user._id;

    // Assuming 'resources' is an array of file URLs
    const resources = req.body.fileUrls || [];

    // Create the task
    const createdTask = await Task.create({
      name: title,
      description,
      subtasks: subTasks,
      deadlineStart: new Date(startDate),
      deadlineEnd: new Date(deadline),
      label,
      color,
      image,
      resource: resources,
      owner: ownerId,
      assignedList: members,
    });

    // Find the column by ID based on the provided status
    const column = await Column.findOne({ _id: status });

    // Link the task to the column
    column.taskList.push(createdTask);
    await column.save();

    // Find the board using the activeBoard information
    const board = await Board.findOne({ _id: activeBoard });

    // Send the updated board as a response
    res.json({ message: "Task created successfully", createdTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task" });
  }
});
router.post(
  "/:boardId/task/:taskId/comment",
  authMiddleware,
  async (req, res) => {
    try {
      const { boardId, taskId } = req.params;
      const { name, content } = req.body;
      const newComment = await Comment.create({
        name,
        content,
      });

      // Find the task by ID and push the new comment
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      task.comment.push(newComment);

      // Save the updated task
      await task.save();

      res.json({
        message: "Comment added successfully",
        comment: newComment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding comment to task" });
    }
  }
);

router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const {
      name,
      description,
      subtasks,
      deadline,
      startDate,
      label,
      color,
      image,
      assignedList,
      comments,
      resources,
    } = req.body;
    const ownerId = req.user._id;

    updatedTask = {
      name,
      description,
      subtasks,
      deadlineStart: new Date(startDate),
      deadlineEnd: new Date(deadline),
      label,
      color,
      image,
      resource: resources,
      owner: ownerId,
      comments,
      assignedList: assignedList,
    };
    const task = await Task.findByIdAndUpdate(taskId, updatedTask);

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task" });
  }
});

router.put("/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const subtaskId = req.params.subtaskId;
    const checked = req.body.checked;

    // Find the task and update the state of the subtask
    const task = await Task.findById(taskId);
    const subtask = task.subtasks.id(subtaskId);
    subtask.checked = checked;

    await task.save();

    res.status(200).json({ message: "Subtask updated successfully" });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Assuming you're using Mongoose for MongoDB
    await Task.deleteOne({ _id: taskId });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/tasks/move", async (req, res) => {
  try {
    const {
      sourceColumnId,
      destinationColumnId,
      sourceIndex,
      destinationIndex,
    } = req.body;
    const sourceColumn = await Column.findOne({ _id: sourceColumnId });
    const destinationColumn = await Column.findOne({
      _id: destinationColumnId,
    });
    if (sourceColumnId == destinationColumnId) {
      const [removedTask] = sourceColumn.taskList.splice(sourceIndex, 1);
      sourceColumn.taskList.splice(destinationIndex, 0, removedTask);
      await sourceColumn.save();
    } else {
      const [removed] = sourceColumn.taskList.splice(sourceIndex, 1);
      destinationColumn.taskList.splice(destinationIndex, 0, removed);
      await sourceColumn.save();
      await destinationColumn.save();
    }

    res.status(200).json({ message: "Task moved successfully" });
  } catch (error) {
    console.error("Error moving task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/columns/:columnId", async (req, res) => {
  try {
    const { columnId } = req.params;

    await Column.deleteOne({ _id: columnId });

    console.log("deleted columns");

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/boards/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const { boardName, columns } = req.body;

    // Find the board by ID
    const board = await Board.findByIdAndUpdate(
      boardId,
      { name: boardName },
      { new: true } // Return the updated board
    );

    // Now update each column individually
    for (const { _id, name } of columns) {
      await Column.findByIdAndUpdate(_id, { name });
    }

    res.status(200).json({ board });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;

  try {
    // Find and delete the board by ID
    const deletedBoard = await Board.findByIdAndDelete(boardId);

    if (!deletedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/invite-member", async (req, res) => {
  const { email, name, role, ownerId, boardId } = req.body;

  try {
    // Check if the email is already invited (you might want to handle this logic)
    const existingAssigned = await Assigned.findOne({
      invitedUser: email,
      board: boardId,
    });

    if (existingAssigned) {
      return res
        .status(400)
        .json({ message: "User already invited to the board" });
    }

    // Create a new Assigned entry
    const newAssigned = new Assigned({
      owner: ownerId,
      invitedUser: email,
      role,
      board: boardId,
      task: [],
    });

    // Save the new Assigned entry
    await newAssigned.save();

    // Assuming you have a Board model, update the access array
    // Add email to access array only if it's not already included
    const board = await Board.findById(boardId);

    const user = await User.findOne({ email: email });

    if (board && user) {
      // Check if the user's ObjectId is not already in the access array
      if (!board.access.some((userId) => userId.equals(user._id))) {
        board.access.push(user._id);
        await board.save();
      }
    }
    res.json({ email, name: user.name, role });
  } catch (error) {
    console.error("Error inviting member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add-member", async (req, res) => {
  const { taskId, member } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the user by email and get their ObjectId
    const user = await User.findOne({ email: member });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user's ObjectId to the assignedList of the task
    task.assignedList.push(user._id);

    // Save the updated task
    await task.save();
    const existingAssigned = await Assigned.findOne({
      invitedUser: member,
    });
    console.log(existingAssigned);
    if (existingAssigned) existingAssigned.task.push(task._id);
    await existingAssigned.save();
    await Task.populate(task, {
      path: "assignedList",
      select: "name email",
    });
    res.json({ message: "Member added to assignedList successfully", task });
  } catch (error) {
    console.error("Error adding member to assignedList:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/invited/:email", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Assuming user ID is stored in req.user from authMiddleware
    const { email } = req.params;

    const boards = await Assigned.find({ invitedUser: user.email });
    // Populate fields as needed
    // For example, you might want to populate owner, access, columns, etc.
    await Assigned.populate(boards, {
      path: "board",
    });

    // // Populate the access field in the created board with name and email
    await Assigned.populate(boards, {
      path: "board.access",
      select: "name email",
    });
    await Assigned.populate(boards, {
      path: "board.columns",
      select: "name taskList ",
    });
    // Populate all fields in each created column

    // // Populate the taskList field in each column inside the created board
    await Assigned.populate(boards, {
      path: "board.columns.taskList",
    });
    await Assigned.populate(boards, {
      path: "board.columns.taskList.assignedList",
    });
    await Assigned.populate(boards, {
      path: "task",
    });
    await Assigned.populate(boards, {
      path: "task.assignedList",
    });

    res.json({ boards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reading boards" });
  }
});
module.exports = router;
